import { getCollection } from 'astro:content';
import { projectsForDomain, sortPublishedProjects, type DomainId } from './project-schema';

export { projectHref } from './project-schema';

export async function getPublishedProjects() {
  return sortPublishedProjects(await getCollection('projects'));
}

export async function getDomainProjects(domainId: DomainId) {
  return projectsForDomain(await getPublishedProjects(), domainId);
}
