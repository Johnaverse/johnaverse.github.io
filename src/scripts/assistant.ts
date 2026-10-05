import { assistantLocales, isAssistantIndex, resolveAssistantReply, type AssistantIndex, type AssistantLocale, type AssistantSource, type ChatMessage } from '../lib/assistant-types';
import type { AssistantCopy } from '../i18n/assistant';

const root = document.querySelector<HTMLElement>('[data-assistant-root]');
if (root) initializeAssistant(root);

function initializeAssistant(root: HTMLElement) {
  const locale = root.dataset.locale as AssistantLocale;
  if (!assistantLocales.includes(locale)) return;
  const text = JSON.parse(root.dataset.copy ?? '{}') as AssistantCopy;
  const endpoint = root.dataset.endpoint ?? '';
  const launch = root.querySelector<HTMLButtonElement>('[data-assistant-launch]')!;
  const dialog = root.querySelector<HTMLDialogElement>('dialog')!;
  const form = root.querySelector<HTMLFormElement>('[data-assistant-form]')!;
  const input = root.querySelector<HTMLTextAreaElement>('[data-assistant-input]')!;
  const send = root.querySelector<HTMLButtonElement>('[data-assistant-send]')!;
  const welcome = root.querySelector<HTMLElement>('[data-assistant-welcome]')!;
  const log = root.querySelector<HTMLElement>('[data-assistant-log]')!;
  const scroll = root.querySelector<HTMLElement>('[data-assistant-scroll]')!;
  const status = root.querySelector<HTMLElement>('[data-assistant-status]')!;
  let indexPromise: Promise<AssistantIndex> | undefined;
  let history: ChatMessage[] = [];
  let busy = false;
  let generation = 0;
  let activeRequest: AbortController | undefined;
  let returnFocus: HTMLElement | null = null;

  launch.hidden = false;
  launch.addEventListener('click', () => {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : launch;
    dialog.showModal(); launch.setAttribute('aria-expanded', 'true'); input.focus();
  });
  root.querySelector('[data-assistant-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { launch.setAttribute('aria-expanded', 'false'); returnFocus?.focus(); });
  root.querySelector('[data-assistant-reset]')?.addEventListener('click', () => {
    generation++; activeRequest?.abort(); history = []; busy = false;
    log.replaceChildren(); welcome.hidden = false; input.value = ''; setBusy(false); input.focus();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-assistant-prompt]').forEach(button => button.addEventListener('click', () => { void ask(button.dataset.assistantPrompt ?? ''); }));
  form.addEventListener('submit', event => { event.preventDefault(); void ask(input.value); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); form.requestSubmit(); }
  });

  function setBusy(value: boolean) {
    busy = value; send.disabled = value; input.readOnly = value;
    log.setAttribute('aria-busy', String(value));
    status.textContent = value ? endpoint ? text.answering : text.searching : '';
  }
  function appendMessage(role: 'user' | 'assistant', content: string, sources: AssistantSource[] = []) {
    const message = document.createElement('article');
    message.className = `assistant-message assistant-message-${role}`;
    const label = document.createElement('span'); label.className = 'assistant-message-label'; label.textContent = role === 'user' ? text.you : text.guide;
    const body = document.createElement('p'); body.className = 'assistant-message-body'; body.textContent = content;
    message.append(label, body);
    if (sources.length) {
      const references = document.createElement('div'); references.className = 'assistant-sources';
      const heading = document.createElement('h4'); heading.textContent = text.sources; references.append(heading);
      sources.forEach((source, i) => {
        const link = document.createElement('a'); link.href = source.url;
        const number = document.createElement('span'); number.textContent = `[${i + 1}]`;
        const title = document.createElement('span'); title.textContent = source.title;
        link.append(number, title); references.append(link);
      });
      message.append(references);
    }
    log.append(message); scroll.scrollTop = scroll.scrollHeight;
  }
  function appendNotice(content: string) {
    const notice = document.createElement('p'); notice.className = 'assistant-notice'; notice.textContent = content; log.append(notice);
  }
  async function getIndex(): Promise<AssistantIndex> {
    if (!indexPromise) indexPromise = fetch(`/assistant/${locale}.json`, { credentials: 'omit', signal: AbortSignal.timeout(8000) }).then(async response => {
      if (!response.ok) throw new Error('Index unavailable');
      const index: unknown = await response.json();
      if (!isAssistantIndex(index, locale)) throw new Error('Invalid website index');
      return index;
    }).catch(error => { indexPromise = undefined; throw error; });
    return indexPromise;
  }
  async function ask(raw: string) {
    const question = raw.trim();
    if (busy || !question) return;
    if (question.length > 600) { status.textContent = text.tooLong; return; }
    const turn = generation;
    const previousQuestion = history.findLast(message => message.role === 'user')?.content ?? '';
    history.push({ role: 'user', content: question }); history = history.slice(-8);
    input.value = ''; welcome.hidden = true; appendMessage('user', question); setBusy(true);
    const request = new AbortController(); activeRequest = request;
    try {
      const [index, search] = await Promise.all([getIndex(), import('../lib/assistant-search')]);
      if (turn !== generation) return;
      const query = search.contextualQuestion(question, previousQuestion);
      let sources = search.retrieveSources(index, query, 3);
      let reply = sources.length ? `${text.found}\n\n${sources.map((source, i) => `[${i + 1}] ${search.sourceExcerpt(source, query)}`).join('\n\n')}` : text.noMatch;
      if (endpoint && sources.length) {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          timeout = setTimeout(() => request.abort(), 25_000);
          const response = await fetch(endpoint, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, messages: history }), signal: request.signal });
          if (!response.ok) throw new Error(response.status === 429 ? 'rate-limit' : 'unavailable');
          const result = resolveAssistantReply(await response.json(), index);
          if (!result) throw new Error('Invalid answer');
          reply = result.reply; sources = result.sources;
        } catch (error) {
          if (turn !== generation) return;
          appendNotice(error instanceof Error && error.message === 'rate-limit' ? text.rateLimit : text.unavailable);
        } finally { if (timeout) clearTimeout(timeout); }
      }
      if (turn !== generation) return;
      appendMessage('assistant', reply, sources); history.push({ role: 'assistant', content: reply.slice(0, 2000) });
    } catch {
      if (turn === generation) appendMessage('assistant', text.loadError);
    } finally {
      if (turn === generation) { setBusy(false); activeRequest = undefined; if (dialog.open) input.focus(); }
    }
  }
}
