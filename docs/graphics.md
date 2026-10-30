# Graphics and provenance

The graphics are editorial illustrations, not evidence of actual deployment topology or photographs of the local lab. Project evidence remains in the written case studies and public source links. Hero captions identify conceptual artwork; lab imagery is labeled illustrative.

## Artwork

Five new illustrations were generated using built-in `image_gen.imagegen` in generation mode. There were no input reference images. Each asset has a 1536 × 1024 primary WebP, a 1280 × 853 variant, and a 640 × 427 variant. WebP conversion uses quality 86 and effort 6. The originals were visually inspected and only resized or converted afterward; no cropping or compositing was applied.

- Homepage: `public/images/engineering-world.webp`. [Exact prompt](graphics-prompts-home.md).
- Cloud and blockchain: `public/images/domains/cloud.webp`, `blockchain.webp`. [Exact prompts](graphics-prompts-cloud-blockchain.md).
- AI and cybersecurity: `public/images/domains/ai.webp`, `cybersecurity.webp`. [Exact prompts](graphics-prompts-ai-security.md).
- Local hardware: `public/images/hardware-lab.webp`. [Existing hardware prompt](image-prompts.md).

`src/components/Artwork.astro` owns responsive image markup, alt descriptions, captions, and loading priority. The first hero image loads eagerly; domain cards and subsequent illustrations load lazily. Explicit dimensions reserve layout space. All images are served locally.

## Project workflows

`src/components/ProjectVisual.astro` draws 14 original, code-native SVG workflows keyed by project ID. Each describes the purpose of a project conceptually. Fleet's Git/Flux and Terraform/Docker paths are separate; branching diagrams avoid suggesting an unsupported sequence. An accessible description accompanies each SVG; there are no external assets or duplicate IDs.

## Motion

Artwork has a subtle ambient light treatment; project flows use moving dashed strokes. Both are paused offscreen, when the document is hidden, and by the site's persistent motion control. System reduced-motion preference disables ambient motion and hover transforms. Graphics remain visible without JavaScript.

To replace artwork, preserve the three filenames, update dimensions and alt text in `Artwork.astro` if necessary, and record the new prompt or provenance here. To add a project diagram, extend the keyed diagram map in `ProjectVisual.astro`; unknown projects receive a general conceptual workflow.
