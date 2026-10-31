// Renders live feeds (threat briefing, blockchain incidents) from a public JSON endpoint.
// Everything is built with DOM nodes and textContent; feed data is never inserted as HTML.
import { parseBriefing, parseIncidents, type Briefing, type BriefingItem, type FeedLink, type Incident, type IncidentFeed, type Pipeline, type Severity } from '../lib/feeds';

type Strings = Record<string, string>;
type Child = Node | string | null | undefined | false;
const STALE_MS = 36 * 60 * 60 * 1000;
const LOCAL_TIME: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
const MAX_BYTES = 512 * 1024;

function h<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, ...children: Child[]): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  for (const child of children) if (child) element.append(child);
  return element;
}

function time(iso: string, locale: string, options: Intl.DateTimeFormatOptions): HTMLTimeElement {
  const element = h('time');
  element.dateTime = iso;
  element.textContent = new Intl.DateTimeFormat(locale, options).format(new Date(iso));
  return element;
}

function external(link: FeedLink): HTMLAnchorElement {
  const anchor = h('a', 'feed-link', link.label);
  anchor.href = link.url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

const severityLabel = (severity: Severity, t: Strings) => (severity === 'unscored' ? t.unscored : t[severity]);
const exploitationLabel = (item: BriefingItem, t: Strings) => (item.exploitation === 'kev' ? t.kev : item.exploitation === 'reported' ? t.reported : t.notExploited);

function sources(links: FeedLink[], t: Strings): HTMLElement | null {
  if (!links.length) return null;
  const line = h('p', 'feed-sources', `${t.sources}: `);
  links.forEach((link, index) => { if (index) line.append(', '); line.append(external(link)); });
  return line;
}

function staleNote(iso: string, t: Strings): HTMLElement | null {
  return Date.now() - Date.parse(iso) > STALE_MS ? h('p', 'feed-stale', t.stale) : null;
}

function footer(pipeline: Pipeline | undefined, gaps: string[], url: string, t: Strings): HTMLElement {
  const foot = h('div', 'feed-foot');
  const status = h('div', 'feed-status');
  if (pipeline) status.append(h('p', `pipeline pipeline-${pipeline.status}`, `${t.collection}: ${t[pipeline.status]}`, pipeline.note && ` · ${pipeline.note}`));
  const raw = h('a', 'feed-raw', t.rawData);
  raw.href = url;
  status.append(raw);
  foot.append(status);
  if (gaps.length) foot.append(h('div', 'feed-gaps', h('h3', '', t.gaps), h('ul', '', ...gaps.map(gap => h('li', '', gap)))));
  return foot;
}

function briefingItem(item: BriefingItem, t: Strings): HTMLLIElement {
  const id = item.id && /^CVE-\d{4}-\d{4,}$/.test(item.id)
    ? Object.assign(h('a', 'fi-id', item.id), { href: `https://nvd.nist.gov/vuln/detail/${item.id}`, target: '_blank', rel: 'noopener noreferrer' })
    : item.id ? h('span', 'fi-id', item.id) : null;
  const detail = h('p', 'fi-detail', h('span', `ex-${item.exploitation}`, exploitationLabel(item, t)));
  if (item.fixedIn) detail.append(h('span', '', `${t.fixedIn} ${item.fixedIn}`));
  if (item.action) detail.append(h('span', 'fi-action', item.action));
  const notes = [item.note, item.cvssNote].filter(Boolean).join(' ');
  return h('li', `feed-item sev-${item.severity}`,
    h('div', 'fi-score', h('strong', '', item.cvss === null ? '—' : item.cvss.toFixed(1)), h('span', '', severityLabel(item.severity, t))),
    h('div', 'fi-main',
      h('p', 'fi-head', id, h('span', 'fi-product', item.product)),
      h('p', 'fi-title', item.title),
      detail,
      notes && h('p', 'fi-note', notes),
      sources(item.sources, t)));
}

function renderBriefing(data: Briefing, url: string, locale: string, t: Strings): Node[] {
  const meta = h('p', 'feed-meta', h('span', '', `${t.published} `, time(data.publishedAt, locale, { ...LOCAL_TIME, weekday: 'long', month: 'long' })));
  if (data.window) {
    const options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' };
    meta.append(h('span', '', `${t.window} `, time(data.window.start, locale, options), ' – ', time(data.window.end, locale, options), ' UTC'));
  }
  return [
    meta,
    staleNote(data.publishedAt, t),
    data.summary && h('p', 'feed-summary', data.summary),
    ...data.groups.map(group => h('section', 'feed-group', h('h3', '', group.title), h('ul', 'feed-items', ...group.items.map(item => briefingItem(item, t))))),
    footer(data.pipeline, data.gaps, url, t),
  ].filter((node): node is HTMLElement => Boolean(node));
}

function incidentItem(incident: Incident, locale: string, t: Strings): HTMLLIElement {
  const options = LOCAL_TIME;
  const when = h('p', 'in-time', `${t.started} `, time(incident.startedAt, locale, options));
  if (incident.resolvedAt) when.append(` · ${t.resolvedAt} `, time(incident.resolvedAt, locale, options));
  return h('li', `incident status-${incident.status} sev-${incident.severity}`,
    h('p', 'in-status', t[incident.status]),
    h('div', 'in-main',
      h('p', 'in-head', h('span', 'in-network', incident.network), h('span', 'in-severity', severityLabel(incident.severity, t))),
      h('p', 'in-title', incident.title),
      incident.summary && h('p', 'in-summary', incident.summary),
      when,
      sources(incident.sources, t)));
}

function renderIncidents(data: IncidentFeed, url: string, locale: string, t: Strings): Node[] {
  return [
    h('p', 'feed-meta', h('span', '', `${t.updated} `, time(data.updatedAt, locale, LOCAL_TIME))),
    staleNote(data.updatedAt, t),
    data.incidents.length ? h('ul', 'incidents', ...data.incidents.map(incident => incidentItem(incident, locale, t))) : h('p', 'feed-state', t.empty),
    footer(data.pipeline, data.gaps, url, t),
  ].filter((node): node is HTMLElement => Boolean(node));
}

async function load(url: string): Promise<unknown> {
  const response = await fetch(url, { cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.text();
  if (body.length > MAX_BYTES) throw new Error('Feed too large');
  return JSON.parse(body);
}

function mount(container: HTMLElement) {
  const { feedKind: kind, feedUrl: url = '', locale = 'en' } = container.dataset;
  const t: Strings = JSON.parse(container.dataset.strings ?? '{}');
  const refreshMs = Math.max(30, Number(container.dataset.refresh) || 600) * 1000;
  let hasData = false;
  let lastLoad = 0;

  const showError = () => {
    if (hasData) return;
    const retry = h('button', 'feed-retry', t.retry);
    retry.type = 'button';
    retry.addEventListener('click', refresh);
    const state = h('p', 'feed-state', `${t.unavailable} `, retry);
    state.lang = locale;
    container.replaceChildren(state);
  };

  async function refresh() {
    lastLoad = Date.now();
    container.setAttribute('aria-busy', 'true');
    try {
      const raw = await load(url);
      const nodes = kind === 'threat-briefing'
        ? (data => data && renderBriefing(data, url, locale, t))(parseBriefing(raw))
        : (data => data && renderIncidents(data, url, locale, t))(parseIncidents(raw));
      if (!nodes) throw new Error('Unrecognised feed format');
      container.replaceChildren(...nodes);
      hasData = true;
    } catch {
      showError();
    } finally {
      container.setAttribute('aria-busy', 'false');
    }
  }

  refresh();
  setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, refreshMs);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastLoad > refreshMs) refresh();
  });
}

document.querySelectorAll<HTMLElement>('.feed[data-feed-url]').forEach(mount);
