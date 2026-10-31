import { existsSync } from 'node:fs';
import path from 'node:path';
import type { DomainId } from './domains';
import { isSafePublicUrl } from '../lib/project-schema';

// Live feeds load in the visitor's browser. A feed is shown when PUBLIC_*_URL points at a public HTTPS JSON
// endpoint (which must allow cross-origin reads), or when its file exists under public/intel/ on this site.
export type FeedKind = 'threat-briefing' | 'blockchain-incidents';
export interface FeedConfig { kind: FeedKind; section: string; url: string; refreshSeconds: number; }

const definitions: { domain: DomainId; kind: FeedKind; section: string; env: string | undefined; file: string; refreshSeconds: number }[] = [
  { domain: 'cybersecurity', kind: 'threat-briefing', section: 'briefing', env: import.meta.env.PUBLIC_THREAT_BRIEFING_URL, file: 'intel/threat-briefing.json', refreshSeconds: 600 },
  { domain: 'blockchain', kind: 'blockchain-incidents', section: 'incidents', env: import.meta.env.PUBLIC_BLOCKCHAIN_INCIDENTS_URL, file: 'intel/blockchain-incidents.json', refreshSeconds: 60 },
];

function resolve(definition: (typeof definitions)[number]): FeedConfig | undefined {
  const external = definition.env?.trim();
  if (external) {
    if (!isSafePublicUrl(external)) throw new Error(`Feed URL for ${definition.kind} must be a public HTTPS URL without credentials.`);
    return { kind: definition.kind, section: definition.section, url: external, refreshSeconds: definition.refreshSeconds };
  }
  if (existsSync(path.join(process.cwd(), 'public', definition.file))) {
    return { kind: definition.kind, section: definition.section, url: `/${definition.file}`, refreshSeconds: definition.refreshSeconds };
  }
  return undefined;
}

export function feedFor(domain: DomainId): FeedConfig | undefined {
  const definition = definitions.find(item => item.domain === domain);
  return definition ? resolve(definition) : undefined;
}
