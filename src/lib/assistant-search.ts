import type { AssistantIndex, AssistantSource } from './assistant-types.ts';

const stopWords = new Set('a an and are as at be been by can could do does for from has have how i in is it its me my of on or our s that the their them there they this to us was we what when where which who why will with would you your john johnathan johnaverse de des du en et est la le les un une au aux avec ce ces dans il je l mon pour quel quelle quels quelles qui son sur sont vous comment fonctionne fonctionne-t-il 什么 什麼 如何 怎麼 怎么 哪些 可以 是否 一个 一個'.split(' '));
const aliases = [
  ['backup', 'backups', 'sauvegarde', 'sauvegardes', '備份', '备份', '3-2-1', '321'],
  ['security', 'cybersecurity', 'securite', 'cybersecurite', '安全', '資安', '资安'],
  ['blockchain', 'blockchains', '區塊鏈', '区块链'],
  ['automation', 'automatisation', '自動化', '自动化'],
  ['experience', 'career', 'professionnel', '經驗', '经验', '職涯', '职业'],
  ['education', 'degree', 'university', 'bsc', 'formation', 'licence', '學歷', '学历', '學位', '学位', '理學士', '理学士', '大學', '大学'],
  ['contact', 'contacter', 'contactez', 'email', 'e-mail', 'courriel', '聯絡', '联系', '電郵', '邮箱'],
  ['hardware', 'lab', 'laboratory', 'laboratoire', '硬體', '硬件', '實驗', '实验'],
  ['monitor', 'monitoring', 'supervision', '監控', '监控', 'grafana'],
];
const wordForms: Record<string, string> = { models: 'model', routing: 'route', routes: 'route', agents: 'agent', workflows: 'workflow', backups: 'backup', nodes: 'node', guardrails: 'guardrail', projects: 'project' };

export function normalizeQuestion(text: string): string {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
}

export function searchTokens(text: string): string[] {
  const normalized = normalizeQuestion(text);
  const words = (normalized.match(/[a-z0-9]+(?:[-+][a-z0-9]+)*/g) ?? []).filter(word => !stopWords.has(word) && word.length > 1);
  for (const run of normalized.match(/[\p{Script=Han}]+/gu) ?? []) {
    if (run.length === 1) words.push(run);
    else for (let i = 0; i < run.length - 1; i++) words.push(run.slice(i, i + 2));
  }
  return [...new Set(words.filter(word => !stopWords.has(word)).map(word => wordForms[word] ?? word))];
}

function queryTokens(question: string): string[] {
  const tokens = new Set(searchTokens(question));
  const normalized = normalizeQuestion(question);
  for (const group of aliases) {
    if (group.some(term => /\p{Script=Han}/u.test(term) ? normalized.includes(term) : searchTokens(term).some(token => tokens.has(token)))) {
      group.forEach(term => searchTokens(term).forEach(token => tokens.add(token)));
    }
  }
  return [...tokens];
}

export function contextualQuestion(question: string, previousQuestion = ''): string {
  if (!previousQuestion) return question;
  const normalized = normalizeQuestion(question).trim();
  return /^(?:tell me more|more details|what else|why|how so|continue|plus de details|dis.m.en plus|et ensuite|更多|詳細|详细|繼續|继续|再說|再说)[.!?。！？\s]*$/u.test(normalized)
    ? `${previousQuestion} ${question}` : question;
}

export function retrieveSources(index: AssistantIndex, question: string, limit = 4): AssistantSource[] {
  const normalized = normalizeQuestion(question);
  if (aliases[6].some(term => /\p{Script=Han}/u.test(term) ? normalized.includes(term) : searchTokens(question).includes(term))) {
    return index.sources.filter(source => source.url.endsWith('/#contact')).slice(0, 1);
  }
  if (/^(?:(?:who is|tell me about|introduce|qui est|presente)\s+(?:johnathan(?: l\.)?|johnaverse)|(?:請|请)?(?:介紹|介绍)(?:一下)?\s*(?:johnathan|johnaverse)|(?:johnathan|johnaverse)\s*(?:是誰|是谁))[?!.。！？\s]*$/u.test(normalizeQuestion(question))) {
    const root = index.locale === 'en' ? '/' : `/${index.locale}/`;
    return index.sources.filter(source => source.url === `${root}#home`).slice(0, Math.min(limit, 2));
  }
  const tokens = queryTokens(question).slice(0, 60);
  const directTokens = new Set(searchTokens(question));
  if (!tokens.length) return [];
  const domain = tokens.includes('blockchain') ? 'blockchain' : tokens.includes('cybersecurity') ? 'cybersecurity' : null;
  const candidates = domain && tokens.includes('experience') ? index.sources.filter(source => source.url.includes(`/${domain}/`)) : index.sources;
  const documents = candidates.map(source => ({ source, words: new Set(searchTokens(`${source.title}\n${source.text}`)), title: new Set(searchTokens(source.title)) }));
  const frequencies = new Map(tokens.map(token => [token, documents.filter(doc => doc.words.has(token)).length]));
  const ranked = documents.map(doc => {
    let score = 0;
    let matches = 0;
    for (const token of tokens) if (doc.words.has(token)) {
      matches++;
      const weight = Math.log(1 + index.sources.length / (1 + (frequencies.get(token) ?? 0)));
      score += weight * (doc.title.has(token) ? 2 : 1) * (directTokens.has(token) ? 3 : 0.35);
    }
    if (/\b(?:3-2-1|321)\b/.test(normalized) && /3-2-1/.test(doc.source.text)) score += 12;
    if (tokens.includes('experience') && doc.source.url.endsWith('#experience')) score *= 1.5;
    if (/^(?:how|comment|如何|怎麼|怎么)/.test(normalized) && /(?:approach|approche|做法|方法)/i.test(doc.source.title)) score *= 1.5;
    return { ...doc, score: matches ? score / Math.pow(Math.max(40, doc.words.size), 0.22) : 0 };
  }).filter(doc => doc.score > 0.15).sort((a, b) => b.score - a.score || a.source.id.localeCompare(b.source.id));
  const result: AssistantSource[] = [];
  const urls = new Set<string>();
  const excerpts = new Set<string>();
  for (const doc of ranked) {
    if (doc.score < ranked[0].score * 0.4) break;
    if (urls.has(doc.source.url)) continue;
    const excerpt = sourceExcerpt(doc.source, question);
    if (excerpts.has(excerpt)) continue;
    urls.add(doc.source.url);
    excerpts.add(excerpt);
    result.push(doc.source);
    if (result.length >= limit) break;
  }
  return result;
}

export function sourceExcerpt(source: AssistantSource, question: string, maxLength = 620): string {
  const tokens = new Set(queryTokens(question));
  const directTokens = new Set(searchTokens(question));
  const ranked = source.paragraphs.map((text, i) => ({ text, i, score: searchTokens(text).reduce((score, token) => score + (directTokens.has(token) ? 3 : tokens.has(token) ? 0.35 : 0), 0)
    + (/\b(?:3-2-1|321)\b/.test(normalizeQuestion(question)) && /3-2-1/.test(text) ? 12 : 0) }))
    .filter(paragraph => paragraph.text.length >= (/\p{Script=Han}/u.test(paragraph.text) ? 20 : 65))
    .sort((a, b) => b.score - a.score || a.i - b.i);
  const hardware = aliases[7].some(term => tokens.has(term)) && /HP ZGX/.test(source.text) && /Synology/.test(source.text);
  const paragraph = hardware ? source.text : ranked[0]?.text ?? source.text;
  if (paragraph.length <= maxLength) return paragraph;
  const candidate = paragraph.slice(0, maxLength);
  const boundary = Math.max(candidate.lastIndexOf('. '), candidate.lastIndexOf('。'), candidate.lastIndexOf('! '));
  return `${candidate.slice(0, boundary > maxLength / 2 ? boundary + 1 : Math.max(candidate.lastIndexOf(' '), maxLength - 40)).trim()}…`;
}
