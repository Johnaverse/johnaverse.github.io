
# Copilot Instructions for johnaverse.github.io

## Project Overview
This repository is a static website, served via GitHub Pages. It is organized around a main homepage (`index.html`) and several major session subpages:

- `blockchain/index.html`: Blockchain Infrastructure Engineer
- `cybersecurity/index.html`: CyberSecurity Engineer
- `cloud/index.html`: Cloud Solutions Provider
- `ai/index.html`: AI Infrastructure & Automation (studying)

There are no build scripts, package managers, or backend code. All content is static HTML and CSS.

## Key Patterns & Structure
- The homepage (`index.html`) features a modern, Tesla-inspired design and links to each session subpage via "Learn More" buttons.
- Each session has its own folder and `index.html` file, using a consistent style and navigation pattern.
- Navigation between pages is handled with relative links (e.g., `blockchain/index.html`).
- No JavaScript frameworks, external CSS, or build tools are used.

## Developer Workflow
- **Edit HTML directly**: All content and layout changes are made by editing HTML files in place.
- **Preview**: Open HTML files in a browser. No local server is required, but you may use one (e.g., `python -m http.server`).
- **Deploy**: Push to the `main` branch to publish via GitHub Pages.

## Conventions
- Use plain HTML5 and CSS only.
- Keep code readable and well-commented.
- Add new major sections as new folders with their own `index.html`.
- Update navigation links in `index.html` and subpages as needed.

## Integration Points
- **GitHub Pages**: The site is published from the `main` branch.
- No external APIs, JavaScript frameworks, or CSS preprocessors.

## What to Avoid
- Do not add build tools, package managers, or backend code.
- Do not introduce external dependencies unless absolutely necessary and approved.

---
For examples of structure and navigation, see `index.html` and the session subpages in `blockchain/`, `cybersecurity/`, `cloud/`, and `ai/`.
