import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSafePublicUrl } from '../src/lib/project-schema.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = 'https://www.johnaverse.cc';
const errors = [];
const namespaceUrls = new Set([
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1999/xlink',
  'http://www.w3.org/1999/xhtml',
  'http://www.sitemaps.org/schemas/sitemap/0.9',
  'http://www.google.com/schemas/sitemap-news/0.9',
  'http://www.google.com/schemas/sitemap-image/1.1',
  'http://www.google.com/schemas/sitemap-video/1.1',
]);
const allowedExtensions = new Set(['.html', '.css', '.js', '.mjs', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.ico', '.woff', '.woff2', '.txt', '.xml', '.json']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }));
  return files.flat();
}

function attributes(tag) {
  const values = new Map();
  for (const match of tag.matchAll(/\b([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    values.set(match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4]));
  }
  return values;
}

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function routeFor(file) {
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  return relative === 'index.html' ? '/' : relative.endsWith('/index.html')
    ? `/${relative.slice(0, -'index.html'.length)}` : `/${relative}`;
}

function issue(file, message) {
  errors.push(`${path.relative(dist, file).replaceAll('\\', '/')}: ${message}`);
}

function scanSensitiveText(file, text) {
  const checks = [
    [/sourceVisibility|repositoryUrl\s*[:=]/i, 'content-schema fields leaked into the output'],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key material'],
    [/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{24,})\b/, 'credential-like value'],
    [/\b(?:ocid1\.[a-z0-9]+\.|arn:aws:[a-z0-9-]+:[^\s"'<>]*:\d{12}:)/i, 'cloud resource or account identifier'],
    [/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"'<>]+/i, 'infrastructure connection string'],
    [/(?:[A-Za-z]:[\\/](?:Users|home)[\\/]|\.codex-remote-attachments|(?:project|library)-file:)/i, 'local source or attachment reference'],
  ];
  for (const [pattern, description] of checks) if (pattern.test(text)) issue(file, description);
  for (const match of text.matchAll(/https?:\/\/[^\s<>"'`]+/g)) {
    const value = decode(match[0]).replace(/[),;]+$/, '');
    if (!namespaceUrls.has(value) && !isSafePublicUrl(value)) issue(file, 'non-public or credential-bearing URL in output');
  }
}

let files;
try {
  files = await walk(dist);
} catch {
  throw new Error('No dist directory. Run the production build before verify-build.');
}

const documents = new Map();
const textFiles = new Map();
for (const file of files) {
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  const extension = path.extname(file).toLowerCase();
  const pagesMarker = relative === '.nojekyll' && !(await readFile(file, 'utf8')).trim();
  if (!pagesMarker && (!allowedExtensions.has(extension) || /(?:^|\/)(?:\.[^/]+|package(?:-lock)?\.json|tsconfig\.json|README[^/]*|AGENTS\.md)$/i.test(relative))) {
    issue(file, 'source, configuration, attachment, or unsupported file in production artifact');
  }
  if (['.html', '.css', '.js', '.mjs', '.svg', '.json', '.txt', '.xml'].includes(extension)) {
    const text = await readFile(file, 'utf8');
    textFiles.set(file, text);
    scanSensitiveText(file, text);
    if (extension === '.html') {
      const ids = [...text.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => decode(match[1]));
      if (new Set(ids).size !== ids.length) issue(file, 'duplicate HTML IDs make fragment navigation ambiguous');
      documents.set(file, { text, ids: new Set(ids) });
    }
  }
}

for (const legacy of ['index.html', 'cloud/index.html', 'ai/index.html', 'blockchain/index.html', 'cybersecurity/index.html', 'cloud/backup/index.html']) {
  if (!documents.has(path.join(dist, legacy))) errors.push(`Missing retained route: ${legacy}`);
}

async function resolveInternal(url) {
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return null; }
  const normalized = path.resolve(dist, `.${pathname}`);
  if (normalized !== dist && !normalized.startsWith(`${dist}${path.sep}`)) return null;
  for (const candidate of [normalized, path.join(normalized, 'index.html'), `${normalized}.html`]) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch { /* Try the next static route form. */ }
  }
  return null;
}

for (const [file, document] of documents) {
  const route = routeFor(file);
  if (route === '/experience/' || route.startsWith('/experience/')) issue(file, 'unexpected experience route');
  const metas = new Map();
  const links = [];
  for (const match of document.text.matchAll(/<(?:meta|link)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (/^<meta\b/i.test(match[0])) metas.set(attrs.get('name') ?? attrs.get('property'), attrs.get('content'));
    else links.push(attrs);
  }
  const title = document.text.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) issue(file, 'missing page title');
  for (const key of ['description', 'og:title', 'og:description', 'og:url', 'og:type', 'twitter:card']) {
    if (!metas.get(key)?.trim()) issue(file, `missing ${key} metadata`);
  }
  const canonical = links.find((link) => link.get('rel') === 'canonical')?.get('href');
  if (canonical !== `${site}${route}`) issue(file, `canonical must match the actual route ${site}${route}`);
  if (metas.get('og:url') !== canonical) issue(file, 'Open Graph URL differs from canonical');
  for (const key of ['og:image', 'twitter:image']) {
    const reference = metas.get(key);
    if (!reference) { issue(file, `missing ${key} metadata`); continue; }
    try {
      const url = new URL(reference);
      if (!isSafePublicUrl(url.href)) issue(file, `unsafe ${key} URL`);
      else if (url.origin === site && !await resolveInternal(url)) issue(file, `missing ${key} asset`);
    } catch { issue(file, `invalid ${key} URL`); }
  }

  for (const match of document.text.matchAll(/<(?:a|link|script|img|source|use)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const reference = attrs.get('href') ?? attrs.get('src');
    if (reference === undefined) continue;
    if (!reference.trim() || reference === '#') { issue(file, 'empty link or hash placeholder'); continue; }
    if (/^(?:mailto:|tel:|data:image\/)/i.test(reference)) continue;
    let url;
    try { url = new URL(reference, `${site}${route}`); } catch { issue(file, 'invalid link or asset URL'); continue; }
    if (url.origin !== site) {
      if (!isSafePublicUrl(url.href)) issue(file, 'unsafe external link or asset');
      continue;
    }
    if (/^\/experience(?:\/|$)/.test(url.pathname)) issue(file, 'unexpected experience link');
    const target = await resolveInternal(url);
    if (!target) { issue(file, `unresolved internal route or asset: ${url.pathname}`); continue; }
    if (url.hash) {
      let fragment;
      try { fragment = decodeURIComponent(url.hash.slice(1)); } catch { issue(file, 'invalid anchor encoding'); continue; }
      if (!documents.get(target)?.ids.has(fragment)) issue(file, `missing internal anchor: ${url.pathname}${url.hash}`);
    }
  }
}

// A sitemap must contain only canonical generated pages, including every published case study.
const sitemapIndex = path.join(dist, 'sitemap-index.xml');
if (!textFiles.has(sitemapIndex)) errors.push('Missing sitemap-index.xml');
const sitemapLocations = new Set();
for (const [file, xml] of textFiles) {
  if (!/^sitemap(?:[-.])/.test(path.basename(file)) || path.extname(file) !== '.xml') continue;
  const isIndex = /<sitemapindex\b/i.test(xml);
  for (const match of xml.matchAll(/<loc\b[^>]*>([^<]+)<\/loc>/gi)) {
    const location = decode(match[1].trim());
    let url;
    try { url = new URL(location); } catch { issue(file, 'invalid sitemap URL'); continue; }
    if (url.origin !== site || url.search || url.hash) { issue(file, 'sitemap contains a non-canonical URL'); continue; }
    const target = await resolveInternal(url);
    if (!target) { issue(file, `sitemap points to a missing route: ${url.pathname}`); continue; }
    if (isIndex) {
      if (path.extname(target) !== '.xml') issue(file, 'sitemap index points to a non-XML artifact');
    } else {
      if (!documents.has(target) || location !== `${site}${routeFor(target)}`) issue(file, 'sitemap URL does not match a generated page canonical');
      if (/^\/(?:404(?:[./]|$)|experience(?:\/|$))/.test(url.pathname)) issue(file, 'sitemap includes a non-content route');
      sitemapLocations.add(location);
    }
  }
}
for (const [file, document] of documents) {
  const route = routeFor(file);
  const noindex = /<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])(?=[^>]*\bcontent\s*=\s*["'][^"']*noindex)[^>]*>/i.test(document.text);
  if (route === '/404.html' || noindex) continue;
  if (!sitemapLocations.has(`${site}${route}`)) issue(file, 'canonical page is absent from the sitemap');
}
const robots = textFiles.get(path.join(dist, 'robots.txt'));
if (!robots?.includes(`Sitemap: ${site}/sitemap-index.xml`)) errors.push('robots.txt must reference the canonical sitemap index');

// The schema validates frontmatter during build. These checks cover generated routes and private prose.
const contentDirectory = path.join(root, 'src', 'content', 'projects');
for (const entry of await readdir(contentDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
  const source = await readFile(path.join(contentDirectory, entry.name), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!frontmatter) throw new Error(`Project frontmatter missing: ${entry.name}`);
  const field = (name) => {
    const value = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    if (!value) return undefined;
    if (value.startsWith('"') || value.startsWith("'")) return value.slice(1, value.indexOf(value[0], 1));
    return value.replace(/\s+#.*$/, '').trim();
  };
  const slug = entry.name.slice(0, -3);
  const primaryDomain = field('primaryDomain');
  const published = field('published') === 'true';
  const output = path.join(dist, primaryDomain ?? '', 'projects', slug, 'index.html');
  if (published && !documents.has(output)) errors.push(`Published project route missing: ${primaryDomain}/${slug}`);
  if (!published && documents.has(output)) issue(output, 'unpublished project has a generated route');
  if (published && field('visibility') === 'private') {
    const permitted = new Set([...frontmatter.matchAll(/https:\/\/[^\s"'\],]+/g)].map((match) => match[0]));
    for (const match of documents.get(output)?.text.matchAll(/<a\b[^>]*>/gi) ?? []) {
      const href = attributes(match[0]).get('href');
      if (!href) continue;
      try {
        const url = new URL(href);
        if (url.hostname === 'github.com' && url.pathname.split('/').filter(Boolean).length >= 2 && !permitted.has(href)) {
          issue(output, 'private project contains an unapproved GitHub repository/source link');
        }
      } catch { /* Relative project navigation is already checked above. */ }
    }
  }
}

assert.equal(errors.length, 0, `Production verification failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
console.log(`Verified ${documents.size} pages: metadata, links, sitemap, retained routes, publication rules, and production privacy guards.`);
