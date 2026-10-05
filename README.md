# Johnaverse

A static engineering portfolio for [johnaverse.cc](https://www.johnaverse.cc), built with Astro. Cloud infrastructure, AI & automation, blockchain and cybersecurity have independent routes, with relevant professional experience embedded in each domain.

## Development

Use Node 24 and pnpm 11.19.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run the complete checks before publishing:

```sh
pnpm check
pnpm test
pnpm build
pnpm preview
```

## Content

Add, edit or unpublish Markdown project entries in `src/content/projects`. Each entry declares a primary domain and optional related domains. Public entries link their repositories; private entries contain sanitized descriptions only. See [the content guide](docs/content-guide.md) for the field reference and examples, and [the evidence notes](docs/content-evidence.md) for attribution boundaries.

Experience is edited in `src/data/experience.ts`, domain introductions in `src/data/domains.ts`. Hardware imagery is an illustrative rendering; [its generation prompt](docs/image-prompts.md) is recorded for maintenance.

## Deployment

Pull requests run type, content and production-build validation. Merging to `main` builds and deploys **only `dist`** through GitHub Actions to GitHub Pages. The existing domain and `/cloud/backup/` route are preserved. Configure the Pages source as **GitHub Actions** and retain `www.johnaverse.cc` as the custom domain in repository settings.

The deployed site needs no server, external font service, analytics, API keys or runtime project discovery. Review all new content before publication; do not place resumes, private URLs or infrastructure configuration in public assets.
