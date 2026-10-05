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

Experience is edited in `src/data/experience.ts`, domain introductions in `src/data/domains.ts`. The homepage and four domains use original conceptual 3D illustrations, with responsive WebP assets and decorative motion that respects the motion control and system preference. Project cards and detail pages include purpose-specific conceptual SVG workflows. [The graphics guide](docs/graphics.md) records assets and exact generation prompts; [the hardware prompt](docs/image-prompts.md) covers the local lab illustration.

## Deployment

Pull requests run type, content and production-build validation. Merging to `main` builds and deploys **only `dist`** through GitHub Actions to GitHub Pages. The existing domain and `/cloud/backup/` route are preserved. Configure the Pages source as **GitHub Actions** and retain `www.johnaverse.cc` as the custom domain in repository settings.

The floating website guide answers questions with cited excerpts from the published pages in all four languages. Its index is regenerated from the rendered site on every build. It works on GitHub Pages without a server or API keys; an optional, separate Cloudflare Worker connects it to a model service. See [the assistant guide](docs/assistant.md) for behavior, privacy, and server configuration.

Review all new content before publication; do not place resumes, private URLs or infrastructure configuration in public assets.
