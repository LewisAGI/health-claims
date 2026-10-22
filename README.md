# Health claims

A static site of health claims. Each claim has an evidence rating and citations. Ratings apply to claims, not to people.

## Develop

```bash
npm ci
npm run dev
```

## Test

```bash
npm test
npm run test:e2e
```

## Build

```bash
npm ci && npm run build
```

The site is written to `dist/`.

## Data

The v3 pack lives in [`data/content.json`](data/content.json) and [`data/sources.json`](data/sources.json). The schema and the quote, episode, and rating rules are in [`data/README.md`](data/README.md).

Quotation marks are used only when `wording_status` marks the wording as verified. Every other claim is a paraphrase. Where no episode was found, the episode is shown as unknown.

## Deploy

The HOHM bridge publishes this site. It runs `npm ci && npm run build` and deploys `dist/` to the Cloudflare Pages project `health-claims`. See `bridge.json`. This repository does not contain Cloudflare credentials.

## Licence

MIT. See `LICENSE`.
