# Live data feeds

The Cybersecurity page shows a daily threat briefing and the Blockchain page shows live network incidents. Both load in the visitor's browser from a JSON file, refresh while the page is open (briefing every 10 minutes, incidents every minute), and render as plain text: feed content is never inserted as HTML.

## Connecting a feed

A section appears only when its feed is configured. Either:

- **Same site:** commit the file to `public/intel/threat-briefing.json` or `public/intel/blockchain-incidents.json`. Every push to `main` redeploys it. No cross-origin setup is needed.
- **Your own endpoint:** set `PUBLIC_THREAT_BRIEFING_URL` or `PUBLIC_BLOCKCHAIN_INCIDENTS_URL` to a public HTTPS URL when building (for example as an `env:` entry on the build step in `.github/workflows/static.yml`). The endpoint must send `Access-Control-Allow-Origin: https://www.johnaverse.cc` (or `*`). The build fails if the URL is not a public HTTPS address.

If the feed cannot be loaded the page says so and offers a retry; it never shows an empty briefing as if nothing happened.

## What to publish

The site renders only the fields below and drops everything else, so internal details such as feed counts, hostnames, connector state or delivery numbers never appear even if the file contains them. Still, publish findings only: the raw JSON is public and linked from the page. Summarise collection health as a single `pipeline.status`.

Text is published as written (in English on every locale page). Keep exploitation claims honest: use `"kev"` only for CISA KEV entries and `"reported"` for anything a source claims but you have not verified.

## Threat briefing: `kind: "threat-briefing"`

```json
{
  "version": 1,
  "kind": "threat-briefing",
  "publishedAt": "2026-10-30T12:00:00Z",
  "window": { "start": "2026-10-29T13:43:35Z", "end": "2026-10-30T13:43:35Z" },
  "summary": "One or two sentences for the top of the briefing.",
  "groups": [
    {
      "title": "Known exploited vulnerabilities",
      "items": [
        {
          "id": "CVE-2026-97229",
          "product": "GitLab",
          "title": "Unauthenticated remote code execution",
          "cvss": 10.0,
          "cvssNote": "Optional note on the score, e.g. not yet scored in NVD.",
          "severity": "critical",
          "exploitation": "kev",
          "fixedIn": "19.4.2",
          "action": "Patch GitLab now.",
          "note": "Optional context.",
          "sources": [{ "label": "Vendor advisory", "url": "https://example.com/advisory" }]
        }
      ]
    }
  ],
  "pipeline": { "status": "healthy", "note": "No action needed." },
  "gaps": ["Anything the reader should know is missing or unverified."]
}
```

- Required: `kind`, `publishedAt` (ISO 8601), and per item `product` and `title`. Items missing either are skipped.
- `cvss` is a number from 0 to 10 or `null`. `severity` is optional (`critical`, `high`, `medium`, `low`, `unscored`); without it the page derives it from `cvss`.
- `exploitation`: `kev`, `reported` or `none`. CVE IDs link to their NVD entry automatically.
- `sources[].url` must be public HTTPS; other links are dropped.
- The page marks a briefing as old once `publishedAt` is more than 36 hours ago.

## Blockchain incidents: `kind: "blockchain-incidents"`

```json
{
  "version": 1,
  "kind": "blockchain-incidents",
  "updatedAt": "2026-10-31T13:50:00Z",
  "incidents": [
    {
      "id": "optional-stable-id",
      "network": "Ethereum",
      "title": "Short description of the incident",
      "status": "investigating",
      "severity": "high",
      "startedAt": "2026-10-31T13:10:00Z",
      "resolvedAt": null,
      "summary": "What is affected and what operators should do.",
      "sources": [{ "label": "Status page", "url": "https://example.com/status" }]
    }
  ],
  "pipeline": { "status": "healthy" },
  "gaps": []
}
```

- Required: `kind`, `updatedAt`, and per incident `network`, `title` and `startedAt`.
- `status`: `investigating`, `monitoring` or `resolved`. Open incidents are listed first, newest first.
- An empty `incidents` list shows "No incidents in this window", so publish the file only when the collector is actually running.

`src/lib/feeds.ts` is the reference for these rules, and `tests/feeds.test.ts` checks the committed briefing against it on every build.
