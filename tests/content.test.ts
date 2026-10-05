import assert from 'node:assert/strict';
import test from 'node:test';
import { projectSchema, projectHref, projectsForDomain, sortPublishedProjects, type ProjectData } from '../src/lib/project-schema.ts';

const safeProject = {
  title: 'A sanitized infrastructure case study',
  summary: 'A concise description of the engineering problem and personal contribution.',
  primaryDomain: 'cloud',
  relatedDomains: ['ai'],
  visibility: 'private',
  attribution: 'integration',
  status: 'maintained',
  tags: ['Terraform'],
  order: 1,
  featured: true,
  published: true,
  evidence: [],
};

test('private projects accept sanitized owner descriptions without a repository link', () => {
  assert.equal(projectSchema.parse(safeProject).visibility, 'private');
});

test('private projects reject repository links and unexpected infrastructure metadata', () => {
  for (const extra of [
    { repositoryUrl: 'https://github.com/owner/private-repository' },
    { internalHostname: 'operations.internal' },
    { attachmentPath: 'private-cv.pdf' },
  ]) {
    assert.equal(projectSchema.safeParse({ ...safeProject, ...extra }).success, false);
  }
});

test('public projects require a GitHub repository URL, separate from attribution', () => {
  const publicProject = { ...safeProject, visibility: 'public', attribution: 'contribution' };
  assert.equal(projectSchema.safeParse(publicProject).success, false);
  assert.equal(projectSchema.safeParse({ ...publicProject, repositoryUrl: 'not-a-url' }).success, false);
  assert.equal(projectSchema.safeParse({ ...publicProject, repositoryUrl: 'https://example.org/project' }).success, false);
  assert.equal(projectSchema.safeParse({ ...publicProject, repositoryUrl: 'https://github.com/Johnaverse/chains-api' }).success, true);
  assert.equal(projectSchema.safeParse({ ...publicProject, repositoryUrl: 'https://github.com/Johnaverse/chains-api/issues' }).success, false);
});

test('evidence rejects credentials, internal endpoints, literal IPs and secret query parameters', () => {
  for (const evidenceUrl of [
    'http://github.com/Johnaverse/chains-api',
    'https://user:password@example.org/project',
    'https://10.0.0.1/project',
    'https://127.1/project',
    'https://[::1]/project',
    'https://localhost/project',
    'https://agent.internal/project',
    'https://internal.company.org/project',
    'https://service.local/project',
    'https://example.org:8443/project',
    'https://example.org/project?api_key=secret',
    'https://example.org/project?token=private-token',
    'https://example.org/project?X-Amz-Signature=signed-download',
  ]) {
    assert.equal(projectSchema.safeParse({ ...safeProject, evidence: [evidenceUrl] }).success, false, evidenceUrl);
  }
  assert.equal(projectSchema.safeParse({ ...safeProject, evidence: ['https://github.com/Johnaverse/chains-api/blob/main/README.md#features'] }).success, true);
});

test('domain mapping is validated and related domains cannot duplicate the primary domain', () => {
  assert.equal(projectSchema.safeParse({ ...safeProject, primaryDomain: 'experience' }).success, false);
  assert.equal(projectSchema.safeParse({ ...safeProject, relatedDomains: ['ai', 'ai'] }).success, false);
  assert.equal(projectSchema.safeParse({ ...safeProject, relatedDomains: ['cloud'] }).success, false);
});

test('unpublishing excludes a project from every listing and related-domain selection', () => {
  const data = projectSchema.parse(safeProject);
  const projects = [
    { id: 'visible', data },
    { id: 'hidden', data: { ...data, published: false, order: 0 } },
    { id: 'earlier', data: { ...data, order: -1 } },
  ];
  assert.deepEqual(sortPublishedProjects(projects).map((project) => project.id), ['earlier', 'visible']);
  assert.deepEqual(projectsForDomain(projects, 'ai').map((project) => project.id), ['earlier', 'visible']);
  assert.deepEqual(projectsForDomain(projects, 'cybersecurity'), []);
  assert.equal(projects[0].id, 'visible', 'selection does not mutate the content collection');
});

test('project routes use the primary domain even when displayed in a related domain', () => {
  const project = { id: 'safe-automation', data: projectSchema.parse(safeProject) };
  assert.equal(projectHref(project), '/cloud/projects/safe-automation/');
  assert.equal(projectHref(projectsForDomain([project], 'ai')[0]), '/cloud/projects/safe-automation/');
  assert.throws(() => projectHref({ ...project, id: '../private' }), /slug/);
});

test('publication and project status remain independent', () => {
  const data = projectSchema.parse({ ...safeProject, status: 'completed', published: false }) as ProjectData;
  assert.equal(data.status, 'completed');
  assert.equal(sortPublishedProjects([{ id: 'completed-project', data }]).length, 0);
});

test('an unconfirmed lifecycle can be omitted without inventing a status', () => {
  const unconfirmed = Object.fromEntries(Object.entries(safeProject).filter(([key]) => key !== 'status'));
  const data = projectSchema.parse(unconfirmed);
  assert.equal(Object.hasOwn(data, 'status'), false);
  assert.equal(data.published, true);
  assert.equal(sortPublishedProjects([{ id: 'unconfirmed-lifecycle', data }]).length, 1);
  assert.equal(projectSchema.safeParse({ ...unconfirmed, status: 'unknown' }).success, false);
});
