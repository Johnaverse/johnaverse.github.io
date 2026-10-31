import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { isSafeHttpsUrl, parseBriefing, parseIncidents } from '../src/lib/feeds.ts';

const committed = JSON.parse(await readFile(new URL('../public/intel/threat-briefing.json', import.meta.url), 'utf8'));

test('the committed threat briefing parses without losing findings', () => {
  const briefing = parseBriefing(committed);
  assert.ok(briefing);
  const raw = committed.groups.flatMap((group: { items: unknown[] }) => group.items);
  assert.equal(briefing.groups.flatMap(group => group.items).length, raw.length);
  assert.equal(briefing.groups[0].items[0].severity, 'critical');
  assert.equal(briefing.groups[0].items[0].exploitation, 'kev');
  assert.equal(briefing.pipeline?.status, 'healthy');
});

test('internal pipeline details are dropped even if a feed includes them', () => {
  const briefing = parseBriefing({
    ...committed,
    feeds: { misp: { fetched: 18, failed: 0 }, opencti: '7/7' },
    pipeline: { status: 'healthy', note: 'No action needed.', bridge: { delivered: 6563, pending: 2172 }, connector: 'paused' },
  });
  const output = JSON.stringify(briefing);
  for (const leaked of ['misp', 'opencti', 'bridge', 'connector', '6563']) assert.equal(output.includes(leaked), false, leaked);
});

test('only public HTTPS source links survive', () => {
  for (const url of ['http://example.com', 'javascript:alert(1)', 'https://user:pass@example.com', 'https://10.0.0.5/x', 'https://grafana.internal/d', 'https://example.com:8443/']) {
    assert.equal(isSafeHttpsUrl(url), false, url);
  }
  assert.equal(isSafeHttpsUrl('https://www.cisa.gov/known-exploited-vulnerabilities-catalog'), true);
  const briefing = parseBriefing({
    ...committed,
    groups: [{ title: 'Test', items: [{ product: 'P', title: 'T', cvss: 5, sources: [{ label: 'Bad', url: 'javascript:alert(1)' }, { label: 'Good', url: 'https://nvd.nist.gov/' }] }] }],
  });
  assert.deepEqual(briefing?.groups[0].items[0].sources, [{ label: 'Good', url: 'https://nvd.nist.gov/' }]);
});

test('unrecognised or undated feeds are rejected', () => {
  assert.equal(parseBriefing({ ...committed, kind: 'something-else' }), null);
  assert.equal(parseBriefing({ ...committed, publishedAt: 'yesterday' }), null);
  assert.equal(parseIncidents(committed), null);
});

test('incidents list active ones first and skip incomplete entries', () => {
  const feed = parseIncidents({
    kind: 'blockchain-incidents',
    updatedAt: '2026-10-31T10:00:00Z',
    incidents: [
      { network: 'Ethereum', title: 'Finality delay', status: 'resolved', startedAt: '2026-10-31T08:00:00Z', resolvedAt: '2026-10-31T09:00:00Z' },
      { network: 'Arbitrum', title: 'Sequencer outage', status: 'investigating', severity: 'high', startedAt: '2026-10-31T09:30:00Z' },
      { network: 'Solana', title: 'Missing start time', status: 'monitoring' },
    ],
  });
  assert.ok(feed);
  assert.deepEqual(feed.incidents.map(incident => incident.network), ['Arbitrum', 'Ethereum']);
});
