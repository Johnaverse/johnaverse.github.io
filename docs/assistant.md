# Website assistant

The floating guide follows the interaction pattern of the [Chains API web UI](https://github.com/Johnaverse/chains-api/tree/main/public): suggested questions, an in-memory conversation, a clear busy state, source links, and a new-conversation control. It uses a native modal dialog for focus containment and Escape dismissal. English, Traditional Chinese, Simplified Chinese, and French have translated controls and starter questions.

## Published content is the knowledge source

After Astro generates the site, `scripts/build-assistant-index.mjs` parses the rendered, indexable HTML. It extracts content from `main` and the homepage contact section into one `/assistant/<locale>.json` per language. It skips noindex pages and navigation, scripts, SVG decoration, and the chat itself. It never reads attachments, raw private repositories or unpublished content. Source IDs and links point back to the generated pages and sections.

Adding, editing, translating, unpublishing or removing a project updates this index on the next build. No second knowledge-base document needs maintenance. The content hash changes with the passages; the client rejects a model response based on a different index version. Use `pnpm build` followed by `pnpm preview` to exercise this build-generated content locally. The ordinary Astro development server does not generate the search index.

## Available immediately on GitHub Pages

With `PUBLIC_ASSISTANT_ENDPOINT` empty, questions are matched to published passages in the browser. The guide presents exact excerpts and links, or says that it cannot find the information. This is source-backed search in a chat interface; it is not a language model. No question leaves the browser and no chat is saved in storage. It supports project/tool names, common domain terms in all four languages, and simple follow-up requests for more detail.

## Optional model service

GitHub Pages hosts static files, so model credentials cannot live in the client. `workers/assistant/index.ts` provides a separate Cloudflare Worker adapter for a LiteLLM or other compatible chat-completion service. It takes `{ locale, messages }`, validates the conversation, fetches the current public corpus from the configured site, retrieves relevant passages, and gives only that public evidence to the model. The service has no operational tools, private-repo access or arbitrary visitor-provided fetch URLs. Answers include passage citations; the client renders plain text and creates links only from its own trusted index. Invalid answers, service failures, timeouts and stale versions fall back to cited local excerpts.

Deployment requires your Cloudflare account and model configuration. This adapter is included for review; the repository's Pages workflow does not deploy it.

1. Review `workers/assistant/wrangler.jsonc`. Set the allowed browser origins and use a rate-limit namespace ID unique within your Cloudflare account. The configured limit is 12 requests per minute per Cloudflare ingress IP, per location. Visitors behind a shared IP share that allowance.
2. With Wrangler, set server-side secrets using `wrangler secret put MODEL_URL --config workers/assistant/wrangler.jsonc`, then `MODEL_NAME`, and optionally `MODEL_API_KEY`. `MODEL_URL` is the complete HTTPS chat-completion URL (including its API path). Keep local hostnames, access tokens and internal topology out of public configuration.
3. Deploy with `wrangler deploy --config workers/assistant/wrangler.jsonc`. No Worker was deployed as part of this change.
4. Set the GitHub repository Actions variable `PUBLIC_ASSISTANT_ENDPOINT` to the public Worker URL ending in `/assistant/chat`. For local production preview, set the same variable in an untracked `.env`. Rebuild the static site.

The adapter rejects unapproved origins, non-JSON or oversized inputs, system/tool roles, and unavailable rate limiting. Provider error details and keys are never returned to visitors. It does not log chat text. Cloudflare's [rate-limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) supplies the ingress limit; configure provider budgets and account-level controls for the model deployment as appropriate. CORS controls browser access; it is not caller authentication.

The endpoint responds with `{ reply, mode, sourceIds, version }`. A custom endpoint must implement the same contract and obtain source IDs/version from the public corpus. The browser resolves IDs against its local index, rather than trusting model-supplied titles or URLs. The AI mode discloses that questions go to the assistant service. History remains in the tab and is lost on navigation or reset.
