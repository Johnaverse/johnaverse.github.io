# Updating project content

Projects live in `src/content/projects/`. Add one Markdown file for each case study, using a lowercase filename with hyphens, such as `cloud-delivery.md`. Its filename becomes the project ID. The build validates its frontmatter before generating a page.

Every project has one primary domain: `cloud`, `ai`, `blockchain`, or `cybersecurity`. Add another domain to `relatedDomains` only when the project demonstrates relevant work there. Related-domain cards link to the same page under the primary domain; they do not create duplicate case studies.

## A private project

Use only an owner-approved, sanitized description. Do not copy private repository files, environment files, configuration, credentials, infrastructure addresses, account IDs, internal links, employer material, CV attachments, or raw screenshots into this directory. Review the prose and assets as carefully as the frontmatter: validation cannot establish permission to disclose a description.

```yaml
---
title: Infrastructure delivery automation
summary: A brief, factual description of the problem and personal contribution.
primaryDomain: cloud
relatedDomains:
  - ai
visibility: private
attribution: integration
status: maintained
tags:
  - Terraform
  - GitHub Actions
order: 10
featured: true
published: false
evidence: []
---
```

Private entries cannot have `repositoryUrl`, including an empty value. Public documentation or other approved public evidence may go in `evidence`; this does not make the underlying project public. Any GitHub source link in a private project's prose must also be listed in `evidence` so its inclusion is explicit and reviewable.

Follow the frontmatter with useful prose: the problem, your role, design decisions, safeguards, tradeoffs, and factual outcomes. State which work you personally performed. Include numbers only when they are supported and safe to share. A repository, tool integration, or job title alone does not prove a performance outcome.

## A public project

Use the same fields, set `visibility: public`, and add `repositoryUrl: https://github.com/owner/repository`. Open the link while logged out to confirm that it is public. The schema validates URL syntax; it cannot determine repository permissions or establish authorship.

Keep attribution separate from visibility:

- `original`: your original project or implementation.
- `integration`: work combining or operating existing tools; describe your own configuration or engineering work.
- `contribution`: a contribution to an existing project; link the relevant pull request or commit in `evidence`.

A fork's presence on your profile does not prove a contribution. Describe the specific work and evidence before publishing it.

## Ordering, status, and removal

`order` controls the ascending order within lists. `featured: true` makes a project eligible for a featured placement. When its lifecycle is confirmed, `status` is `active`, `maintained`, `research`, or `completed`. Omit `status` when it is unconfirmed; do not choose a label to fill the field. Lifecycle status is independent of whether the page is published.

Set `published: true` after reviewing the content. Set it to `false` to remove the page and all project-card appearances on the next build. Deleting the Markdown file also removes it. Keep `published: false` while exact project names, ownership, links, or sanitized descriptions are unresolved.

Evidence links must use HTTPS and public hostnames. Credentials, IP addresses, internal hostnames, custom ports, and secret query parameters are rejected. This is a syntax guard, not a network or permissions check: verify every link's public accessibility yourself.

## Checks before publishing

Use Node.js 24 and the repository's pinned pnpm version. Run `pnpm test` for the schema and publication checks, then `pnpm check` and `pnpm build`, or run all three with `pnpm validate`. The production build includes the artifact verifier. It checks page metadata and social images, internal links and anchors, canonical sitemap entries, retained domain URLs, unpublished routes, private source links, and accidental source/attachment or credential material in `dist/`.

GitHub Pages receives the generated `dist/` artifact. Editing content does not require runtime GitHub access, a model service, a database, or a content management system.
