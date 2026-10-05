# Johnaverse portfolio

This is a static Astro site deployed to GitHub Pages. Use Node 24 and pnpm 11.19.0.

- Pages and components live in src/pages and src/components.
- Domain content lives in src/data/domains.ts; CV-supported experience lives in src/data/experience.ts and is embedded in each relevant domain.
- Project cases live in src/content/projects/*.md. Follow docs/content-guide.md and the schema in src/lib/project-schema.ts.
- Use getPublishedProjects(), getDomainProjects() and projectHref() for all lists and routes. Unpublished content must never have a route or appear in a list.
- Public repositories require attribution and a public link. Private overviews must never include repository links, credentials, internal endpoints or identifying deployment configuration.
- Do not invent metrics, responsibilities, product guarantees or employment achievements. Preserve each source’s attribution.
- Keep the site usable without JavaScript. Respect reduced motion and the visitor’s motion preference. Maintain keyboard navigation and visible focus.
- Run pnpm check, pnpm test, and pnpm build. Build validation checks routes, internal links, metadata and publication boundaries.
- Deployment uploads only dist; source files and resumes are never deployment artifacts.
