// Live feed format, shared by the browser renderer and the tests.
// Parsing keeps only the fields below, so anything else a pipeline sends (internal counts, hostnames, connector state) is dropped.

export type Exploitation = 'kev' | 'reported' | 'none';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unscored';
export type PipelineStatus = 'healthy' | 'degraded' | 'down';
export type IncidentStatus = 'investigating' | 'monitoring' | 'resolved';

export interface FeedLink { label: string; url: string; }
export interface Pipeline { status: PipelineStatus; note?: string; }

export interface BriefingItem {
  id?: string;
  product: string;
  title: string;
  cvss: number | null;
  cvssNote?: string;
  severity: Severity;
  exploitation: Exploitation;
  fixedIn?: string;
  action?: string;
  note?: string;
  sources: FeedLink[];
}
export interface Briefing {
  publishedAt: string;
  window?: { start: string; end: string };
  summary?: string;
  groups: { title: string; items: BriefingItem[] }[];
  pipeline?: Pipeline;
  gaps: string[];
}

export interface Incident {
  id?: string;
  network: string;
  title: string;
  status: IncidentStatus;
  severity: Severity;
  startedAt: string;
  resolvedAt?: string;
  summary?: string;
  sources: FeedLink[];
}
export interface IncidentFeed {
  updatedAt: string;
  incidents: Incident[];
  pipeline?: Pipeline;
  gaps: string[];
}

const LIMITS = { text: 600, short: 120, groups: 12, items: 40, incidents: 60, gaps: 12, sources: 6 };
type Raw = Record<string, unknown>;
const isObject = (value: unknown): value is Raw => typeof value === 'object' && value !== null && !Array.isArray(value);
const list = (value: unknown, max: number): unknown[] => (Array.isArray(value) ? value.slice(0, max) : []);

function text(value: unknown, max = LIMITS.text): string | undefined {
  if (typeof value !== 'string') return undefined;
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean ? clean.slice(0, max) : undefined;
}

function date(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const time = Date.parse(value);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

/** Public HTTPS links only: no credentials, custom ports, IP hosts or private names. */
export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) return false;
    if (!host.includes('.') || host.includes(':') || /^\d+(?:\.\d+){3}$/.test(host)) return false;
    return !/(?:^|\.)(?:localhost|local|internal|intranet|lan|home|corp)$/.test(host);
  } catch {
    return false;
  }
}

function links(value: unknown): FeedLink[] {
  return list(value, LIMITS.sources).flatMap(entry => {
    if (!isObject(entry)) return [];
    const label = text(entry.label, LIMITS.short);
    const url = typeof entry.url === 'string' ? entry.url.trim() : '';
    return label && isSafeHttpsUrl(url) ? [{ label, url }] : [];
  });
}

function pipeline(value: unknown): Pipeline | undefined {
  if (!isObject(value)) return undefined;
  const status = oneOf(value.status, ['healthy', 'degraded', 'down'] as const, 'degraded');
  return { status, note: text(value.note, LIMITS.short) };
}

export function severityFromCvss(cvss: number | null): Severity {
  if (cvss === null) return 'unscored';
  if (cvss >= 9) return 'critical';
  if (cvss >= 7) return 'high';
  if (cvss >= 4) return 'medium';
  return 'low';
}

const SEVERITIES = ['critical', 'high', 'medium', 'low', 'unscored'] as const;

function briefingItem(value: unknown): BriefingItem[] {
  if (!isObject(value)) return [];
  const title = text(value.title, LIMITS.short);
  const product = text(value.product, LIMITS.short);
  if (!title || !product) return [];
  const cvss = typeof value.cvss === 'number' && value.cvss >= 0 && value.cvss <= 10 ? Math.round(value.cvss * 10) / 10 : null;
  const id = text(value.id, 40);
  return [{
    id: id && /^[A-Z][A-Z0-9-]{2,39}$/.test(id) ? id : undefined,
    product,
    title,
    cvss,
    cvssNote: text(value.cvssNote, LIMITS.short),
    severity: oneOf(value.severity, SEVERITIES, severityFromCvss(cvss)),
    exploitation: oneOf(value.exploitation, ['kev', 'reported', 'none'] as const, 'none'),
    fixedIn: text(value.fixedIn, 60),
    action: text(value.action, LIMITS.short),
    note: text(value.note, 240),
    sources: links(value.sources),
  }];
}

export function parseBriefing(raw: unknown): Briefing | null {
  if (!isObject(raw) || raw.kind !== 'threat-briefing') return null;
  const publishedAt = date(raw.publishedAt);
  if (!publishedAt) return null;
  const start = isObject(raw.window) ? date(raw.window.start) : undefined;
  const end = isObject(raw.window) ? date(raw.window.end) : undefined;
  const groups = list(raw.groups, LIMITS.groups).flatMap(group => {
    if (!isObject(group)) return [];
    const title = text(group.title, LIMITS.short);
    const items = list(group.items, LIMITS.items).flatMap(briefingItem);
    return title && items.length ? [{ title, items }] : [];
  });
  return {
    publishedAt,
    window: start && end ? { start, end } : undefined,
    summary: text(raw.summary),
    groups,
    pipeline: pipeline(raw.pipeline),
    gaps: list(raw.gaps, LIMITS.gaps).flatMap(gap => text(gap, 240) ?? []),
  };
}

function incident(value: unknown): Incident[] {
  if (!isObject(value)) return [];
  const title = text(value.title, LIMITS.short);
  const network = text(value.network, 60);
  const startedAt = date(value.startedAt);
  if (!title || !network || !startedAt) return [];
  return [{
    id: text(value.id, 60),
    network,
    title,
    status: oneOf(value.status, ['investigating', 'monitoring', 'resolved'] as const, 'investigating'),
    severity: oneOf(value.severity, SEVERITIES, 'unscored'),
    startedAt,
    resolvedAt: date(value.resolvedAt),
    summary: text(value.summary, 400),
    sources: links(value.sources),
  }];
}

export function parseIncidents(raw: unknown): IncidentFeed | null {
  if (!isObject(raw) || raw.kind !== 'blockchain-incidents') return null;
  const updatedAt = date(raw.updatedAt);
  if (!updatedAt) return null;
  const order: Record<IncidentStatus, number> = { investigating: 0, monitoring: 1, resolved: 2 };
  const incidents = list(raw.incidents, LIMITS.incidents).flatMap(incident)
    .sort((a, b) => order[a.status] - order[b.status] || b.startedAt.localeCompare(a.startedAt));
  return { updatedAt, incidents, pipeline: pipeline(raw.pipeline), gaps: list(raw.gaps, LIMITS.gaps).flatMap(gap => text(gap, 240) ?? []) };
}
