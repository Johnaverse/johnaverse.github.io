import { parse } from 'parse5';
import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const locales = ['en', 'zh-Hant', 'zh-Hans', 'fr'];
const excluded = new Set(['nav', 'script', 'style', 'svg', 'button', 'dialog']);
const blockTags = new Set(['h1', 'h2', 'h3', 'h4', 'p', 'li', 'figcaption']);
const attrs = node => Object.fromEntries((node.attrs ?? []).map(attr => [attr.name, attr.value]));
function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.childNodes ?? []) { const match = find(child, predicate); if (match) return match; }
}
function text(node) {
  if (excluded.has(node.nodeName) || attrs(node)['aria-hidden'] === 'true') return '';
  if (node.nodeName === '#text') return node.value;
  const value = (node.childNodes ?? []).map(text).join(' ').replace(/\s+/g, ' ').trim();
  const href = attrs(node).href;
  return node.nodeName === 'a' && href?.startsWith('https://') ? `${value} (${href})` : value;
}
function blocks(node, anchor = '', result = []) {
  const attributes = attrs(node);
  if (excluded.has(node.nodeName) || attributes['aria-hidden'] === 'true' || /(?:^|\s)(?:back-link|button|text-link)(?:\s|$)/.test(attributes.class ?? '')) return result;
  if (attributes.id && attributes.id !== 'main') anchor = attributes.id;
  if (blockTags.has(node.nodeName) || ['hero-personal', 'career-strip', 'education-line', 'hardware-list'].some(name => (attributes.class ?? '').split(' ').includes(name))
    || (node.nodeName === 'a' && attributes.href?.startsWith('https://'))) {
    const value = text(node);
    if (value) result.push({ text: value, anchor, heading: /^h[1-4]$/.test(node.nodeName) });
  } else for (const child of node.childNodes ?? []) blocks(child, anchor, result);
  return result;
}

// Parse only rendered, indexable pages. Raw project files, CVs and unpublished entries never enter this index.
export function extractPage(html, url) {
  const document = parse(html);
  const htmlNode = find(document, node => node.nodeName === 'html');
  const locale = attrs(htmlNode ?? {}).lang;
  if (!locales.includes(locale) || find(document, node => node.nodeName === 'meta' && attrs(node).name === 'robots' && /noindex/i.test(attrs(node).content ?? ''))) return null;
  const main = find(document, node => node.nodeName === 'main');
  if (!main) return null;
  const title = text(find(document, node => node.nodeName === 'title') ?? {}).split(' — ')[0];
  const sources = [];
  let current = [];
  let heading = title;
  let anchor = '';
  const flush = () => {
    if (!current.length) return;
    const paragraphs = current.map(block => block.text);
    const content = `${heading}\n${paragraphs.join('\n')}`;
    if (content.length >= 35) sources.push({ id: `${url}:${sources.length}`, title: heading === title ? title : `${title} / ${heading}`, url: `${url}${anchor ? `#${anchor}` : ''}`, text: content, paragraphs });
    current = [];
  };
  for (const block of blocks(main)) {
    const newSection = block.anchor !== anchor;
    if ((current.length && newSection) || (block.heading && current.reduce((length, item) => length + item.text.length, 0) >= 160)
      || current.reduce((length, item) => length + item.text.length, block.text.length) > 1850) flush();
    if (!current.length) { if (newSection) heading = title; if (block.heading) heading = block.text; anchor = block.anchor; }
    // Long prose is split at a word boundary, without rewriting the published text.
    let remainder = block.text;
    while (remainder.length > 2000) {
      const split = Math.max(remainder.lastIndexOf(' ', 1900), 1800);
      current.push({ ...block, text: remainder.slice(0, split) }); flush(); remainder = remainder.slice(split).trim();
    }
    current.push({ ...block, text: remainder });
  }
  flush();
  if (url === '/' || url === `/${locale}/`) {
    const contact = find(document, node => node.nodeName === 'footer' && attrs(node).id === 'contact');
    const contactTop = contact && find(contact, node => (attrs(node).class ?? '').split(' ').includes('footer-top'));
    if (contactTop) sources.push({ id: `${url}:contact`, title: `${title} / ${text(find(contactTop, node => node.nodeName === 'h2') ?? {})}`, url: `${url}#contact`, text: text(contactTop), paragraphs: [text(contactTop)] });
  }
  return { locale, url, sources };
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)));
  return files.flat();
}
export async function buildAssistantIndexes(dist) {
  const pages = [];
  for (const file of (await walk(dist)).filter(file => file.endsWith('.html')).sort()) {
    const relative = path.relative(dist, file).replaceAll('\\', '/');
    const url = relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
    const page = extractPage(await readFile(file, 'utf8'), url);
    if (page) pages.push(page);
  }
  await mkdir(path.join(dist, 'assistant'), { recursive: true });
  for (const locale of locales) {
    const matching = pages.filter(page => page.locale === locale);
    if (!matching.length) throw new Error(`Assistant has no pages for ${locale}`);
    const sources = matching.flatMap(page => page.sources);
    const version = createHash('sha256').update(JSON.stringify(sources)).digest('hex');
    await writeFile(path.join(dist, 'assistant', `${locale}.json`), JSON.stringify({ version, locale, pages: matching.length, sources }));
  }
  console.log(`Indexed ${pages.length} published pages for the four-language website assistant.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildAssistantIndexes(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist'));
}
