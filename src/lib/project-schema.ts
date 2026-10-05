import { z } from 'zod';

export const domainIds = ['cloud', 'ai', 'blockchain', 'cybersecurity'] as const;
export type DomainId = (typeof domainIds)[number];

const nonPublicSuffixes = [
  'localhost', 'local', 'internal', 'intranet', 'lan', 'home', 'test',
  'invalid', 'example', 'onion', 'arpa',
];

/** Syntax checks are a publishing guard; authors must still verify public access. */
export function isSafePublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    if (url.port && url.port !== '443') return false;
    if (!hostname.includes('.') || hostname.includes(':') || /^\d+(?:\.\d+){3}$/.test(hostname)) return false;
    if (nonPublicSuffixes.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`))) return false;
    if (/(?:^|\.)(?:localhost|intranet|internal)(?:\.|$)/.test(hostname)) return false;
    if ([...url.searchParams.keys()].some((key) => /^(?:access[_-]?token|api[_-]?key|token|key|password|secret|signature|credential|auth|authorization|sig|x-(?:amz|goog)-(?:signature|credential|security-token))$/i.test(key))) return false;
    return true;
  } catch {
    return false;
  }
}

const publicUrl = z.string().trim().pipe(z.url()).refine(isSafePublicUrl, {
  message: 'Use a public HTTPS URL without credentials, private hostnames, IP addresses, secret query parameters, or custom ports.',
});

const repositoryUrl = publicUrl.refine((value) => {
  try {
    const url = new URL(value);
    return url.hostname === 'github.com' && !url.search && !url.hash
      && /^\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}, { message: 'Use the public GitHub repository URL, such as https://github.com/owner/repository.' });

const sharedFields = {
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  primaryDomain: z.enum(domainIds),
  relatedDomains: z.array(z.enum(domainIds)).default([]),
  attribution: z.enum(['original', 'integration', 'contribution']),
  status: z.enum(['active', 'maintained', 'research', 'completed']).optional(),
  tags: z.array(z.string().trim().min(1)),
  order: z.number(),
  featured: z.boolean(),
  published: z.boolean(),
  evidence: z.array(publicUrl).default([]),
};

export const projectSchema = z.discriminatedUnion('visibility', [
  z.object({ ...sharedFields, visibility: z.literal('public'), repositoryUrl }).strict(),
  z.object({ ...sharedFields, visibility: z.literal('private'), repositoryUrl: z.never().optional() }).strict(),
]).superRefine((project, context) => {
  if (new Set(project.relatedDomains).size !== project.relatedDomains.length) {
    context.addIssue({ code: 'custom', path: ['relatedDomains'], message: 'List each related domain once.' });
  }
  if (project.relatedDomains.includes(project.primaryDomain)) {
    context.addIssue({ code: 'custom', path: ['relatedDomains'], message: 'The primary domain must not also appear in relatedDomains.' });
  }
});

export type ProjectData = z.infer<typeof projectSchema>;
export type ProjectLike = { id: string; data: ProjectData };

/** Related-domain cards always link to this single canonical project route. */
export function projectHref(project: Pick<ProjectLike, 'id'> & { data: Pick<ProjectData, 'primaryDomain'> }): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) {
    throw new Error(`Project id must be a lowercase, hyphenated slug: ${project.id}`);
  }
  return `/${project.data.primaryDomain}/projects/${project.id}/`;
}

export function sortPublishedProjects<T extends ProjectLike>(projects: readonly T[]): T[] {
  return projects.filter((project) => project.data.published)
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

export function projectsForDomain<T extends ProjectLike>(projects: readonly T[], domain: DomainId): T[] {
  return sortPublishedProjects(projects).filter((project) =>
    project.data.primaryDomain === domain || project.data.relatedDomains.includes(domain));
}
