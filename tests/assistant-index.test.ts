import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { extractPage, buildAssistantIndexes } from '../scripts/build-assistant-index.mjs';

const html = (locale = 'en', extra = '') => `<!doctype html><html lang="${locale}"><head><title>Public project — Johnaverse</title>${extra}</head><body><nav>Unrelated navigation</nav><main><section id="overview"><h1>Public backup strategy</h1><p>Three copies of important data on two types of storage, with one copy off-site.</p><a href="https://github.com/Johnaverse/chains-api">Public source</a><script>Not published prose</script><svg><text>Decorative SVG</text></svg></section></main></body></html>`;

test('the index extracts only readable published HTML and retains source URLs and anchors', () => {
  const page = extractPage(html(), '/cloud/backup/');
  assert.equal(page?.locale, 'en');
  const serialized = JSON.stringify(page);
  assert.match(serialized, /three|Three/); assert.match(serialized, /#overview/);
  assert.match(serialized, /github.com\/Johnaverse\/chains-api/);
  assert.doesNotMatch(serialized, /Unrelated navigation|Not published prose|Decorative SVG/);
  assert.equal(extractPage(html('en', '<meta name="robots" content="noindex">'), '/404.html'), null);
});
test('rebuilding removes an unpublished page from every language index', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'johnaverse-assistant-'));
  try {
    await writeFile(path.join(directory, 'index.html'), html());
    for (const locale of ['zh-Hant', 'zh-Hans', 'fr']) {
      await mkdir(path.join(directory, locale)); await writeFile(path.join(directory, locale, 'index.html'), html(locale));
    }
    const locales = ['en', 'zh-Hant', 'zh-Hans', 'fr'];
    const projects = locales.map(locale => path.join(directory, locale === 'en' ? '' : locale, 'project'));
    for (const [i, project] of projects.entries()) {
      await mkdir(project); await writeFile(path.join(project, 'index.html'), html(locales[i]).replace('Public backup strategy', 'RemovableProject'));
    }
    await buildAssistantIndexes(directory);
    const initial = await Promise.all(locales.map(locale => readFile(path.join(directory, 'assistant', `${locale}.json`), 'utf8')));
    initial.forEach(value => assert.match(value, /RemovableProject/));
    await Promise.all(projects.map(project => rm(path.join(project, 'index.html'))));
    await buildAssistantIndexes(directory);
    const updated = await Promise.all(locales.map(locale => readFile(path.join(directory, 'assistant', `${locale}.json`), 'utf8')));
    updated.forEach((value, i) => { assert.doesNotMatch(value, /RemovableProject/); assert.notEqual(JSON.parse(initial[i]).version, JSON.parse(value).version); });
  } finally {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(tmpdir()));
    assert.ok(path.basename(directory).startsWith('johnaverse-assistant-'));
    await rm(directory, { recursive: true, force: true });
  }
});
