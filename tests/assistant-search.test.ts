import assert from 'node:assert/strict';
import test from 'node:test';
import { retrieveSources, sourceExcerpt, contextualQuestion } from '../src/lib/assistant-search.ts';
import { isAssistantIndex, resolveAssistantReply, type AssistantIndex } from '../src/lib/assistant-types.ts';

const index: AssistantIndex = { locale: 'en', version: 'a'.repeat(64), pages: 2, sources: [
  { id: '/cloud/backup/:0', title: 'Backup strategy', url: '/cloud/backup/', text: 'Backup strategy\nThe 3-2-1 backup strategy keeps three copies on two storage types, with one off-site.', paragraphs: ['The 3-2-1 backup strategy keeps three copies on two storage types, with one off-site.'] },
  { id: '/blockchain/:0', title: 'Blockchain operations', url: '/blockchain/#experience', text: 'Blockchain operations\nJohnathan operates Firehose and Substreams blockchain services at Pinax.', paragraphs: ['Johnathan operates Firehose and Substreams blockchain services at Pinax.'] },
] };

test('questions retrieve relevant public passages and unmatched questions return no invented answer', () => {
  assert.equal(retrieveSources(index, 'How do backups work?')[0]?.url, '/cloud/backup/');
  assert.equal(retrieveSources(index, 'Tell me about Firehose')[0]?.url, '/blockchain/#experience');
  assert.equal(retrieveSources(index, 'What is his favourite sandwich?').length, 0);
  assert.equal(sourceExcerpt(index.sources[0], 'backup'), index.sources[0].paragraphs[0]);
});
test('Traditional Chinese, Simplified Chinese and French questions find their own content', () => {
  for (const [locale, question, passage] of [
    ['zh-Hant', '如何進行備份？', '3-2-1 備份原則：重要資料保留三份副本，其中一份置於異地。'],
    ['zh-Hans', '如何进行备份？', '3-2-1 备份原则：重要数据保留三份副本，其中一份保存在异地。'],
    ['fr', 'Comment fonctionne la sauvegarde ?', 'La sauvegarde 3-2-1 utilise trois copies, deux types de supports et une copie hors site.'],
  ] as const) {
    const translated: AssistantIndex = { ...index, locale, sources: [{ ...index.sources[0], id: `${locale}:0`, title: passage, url: `/${locale}/cloud/backup/`, text: passage, paragraphs: [passage] }] };
    assert.equal(retrieveSources(translated, question)[0]?.url, `/${locale}/cloud/backup/`);
  }
});
test('follow-up context is used only for a request that refers back to the previous question', () => {
  assert.match(contextualQuestion('Tell me more', 'How do backups work?'), /backups/);
  assert.equal(contextualQuestion('What is Firehose?', 'How do backups work?'), 'What is Firehose?');
});
test('remote answers cannot introduce sources or silently use a different content version', () => {
  const response = { reply: 'Three copies [1].', mode: 'ai', sourceIds: [index.sources[0].id], version: index.version };
  assert.equal(resolveAssistantReply(response, index)?.sources[0].url, '/cloud/backup/');
  assert.equal(resolveAssistantReply({ ...response, sourceIds: ['invented-source'] }, index), null);
  assert.equal(resolveAssistantReply({ ...response, version: 'b'.repeat(64) }, index), null);
  assert.equal(resolveAssistantReply({ ...response, sourceIds: [index.sources[0].id, index.sources[0].id] }, index), null);
  assert.equal(isAssistantIndex(index, 'en'), true);
  assert.equal(isAssistantIndex({ ...index, sources: [{ ...index.sources[0], url: '//another.example.com/' }] }, 'en'), false);
  assert.equal(isAssistantIndex({ ...index, sources: [{ ...index.sources[0], url: '/fr/cloud/backup/' }] }, 'en'), false);
  assert.equal(isAssistantIndex({ ...index, sources: [null] }, 'en'), false);
});
