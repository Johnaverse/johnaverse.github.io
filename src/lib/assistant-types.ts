export const assistantLocales = ['en', 'zh-Hant', 'zh-Hans', 'fr'] as const;
export type AssistantLocale = (typeof assistantLocales)[number];
export interface AssistantSource {
  id: string;
  title: string;
  url: string;
  text: string;
  paragraphs: string[];
}
export interface AssistantIndex {
  version: string;
  locale: AssistantLocale;
  pages: number;
  sources: AssistantSource[];
}
export interface ChatMessage { role: 'user' | 'assistant'; content: string; }
export interface AssistantReply { reply: string; sourceIds: string[]; version: string; mode: 'search' | 'ai'; }

export function resolveAssistantReply(value: unknown, index: AssistantIndex): { reply: string; sources: AssistantSource[] } | null {
  if (!value || typeof value !== 'object') return null;
  const answer = value as AssistantReply;
  if (answer.version !== index.version || !['search', 'ai'].includes(answer.mode) || typeof answer.reply !== 'string'
    || !answer.reply.trim() || answer.reply.length > 5000 || !Array.isArray(answer.sourceIds)
    || !answer.sourceIds.length || answer.sourceIds.length > 5 || new Set(answer.sourceIds).size !== answer.sourceIds.length) return null;
  const sources = answer.sourceIds.map(id => index.sources.find(source => source.id === id));
  return sources.some(source => !source) ? null : { reply: answer.reply, sources: sources as AssistantSource[] };
}

export function isAssistantIndex(value: unknown, locale: string): value is AssistantIndex {
  if (!value || typeof value !== 'object') return false;
  const index = value as AssistantIndex;
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  return assistantLocales.includes(index.locale) && index.locale === locale
    && typeof index.version === 'string' && /^[a-f0-9]{64}$/.test(index.version)
    && Number.isInteger(index.pages) && index.pages > 0
    && Array.isArray(index.sources) && index.sources.length > 0 && index.sources.length <= 2000
    && new Set(index.sources.map(source => source?.id)).size === index.sources.length
    && index.sources.every(source => source && typeof source.id === 'string' && source.id.length > 0 && source.id.length <= 180
      && typeof source.title === 'string' && source.title.length <= 400
      && typeof source.url === 'string' && source.url.startsWith(prefix) && !source.url.startsWith('//')
      && (locale !== 'en' || !/^\/(?:zh-Hant|zh-Hans|fr)(?:\/|#|$)/.test(source.url))
      && !source.url.includes('..') && !/[\\\s?]/.test(source.url)
      && typeof source.text === 'string' && source.text.length <= 2600
      && Array.isArray(source.paragraphs) && source.paragraphs.every(p => typeof p === 'string' && p.length <= 2200));
}
