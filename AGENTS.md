# WordWise — AI Agent Instructions

## Overview

WordWise is a reflective word-of-the-day practice app. Node.js + Express, deployed on Vercel behind Cloudflare.

## Rules

1. Active project (not dormant — daily batch system implemented July 2026).
2. Branching: `feat/*`, `fix/*`, `docs/*`, `refactor/*`, `chore/*`.
3. `main` branch is protected — requires PR with 1 approval.
4. Always test locally with `npm start` before deploying.

## Architecture summary

- **Daily batch**: 50 words selected via date-seeded PRNG (Mulberry32). Deterministic — same date always yields same pool.
- **Word serving**: `GET /api/word?slot=N` returns word at that slot position in today's pool. Client stores `nextSlot` in `localStorage`.
- **Media**: Pexels API fetches nature landscapes (photos 50%, videos 50%). Pre-fetched in background batch on first request of the day.
- **Cache**: `defCache` (word definitions, seeded from `words.json`), `mediaCache` (Pexels URLs). In-memory, per-instance.
- **Fallback**: Words not found in Dictionary API get a random curated word's definition from `words.json`.

## Key technical details

- Seeded PRNG: `seededRandom(dateString)` produces reproducible shuffle of the 20K+ word list, taking first 50.
- Slot wrapping: `(slot + 1) % 50` — after 49th word, wraps back to 0.
- Background pre-fetch: `preFetchBatchMedia()` iterates through all 50 words, fetching one Pexels URL each. Runs once per day per instance.
- Timeouts: Pexels fetch has 3s timeout, Dictionary API has 4s timeout.
- Curated fallback: `words.json` has 31 pre-defined words — enough to seed initial cache. For Dictionary misses, falls back gracefully with just a definition string (no mismatched phonetic).

## Deployment

```bash
vercel --prod --scope sparsh-sams-projects
```

Vercel project is linked — just run from repo root. Auto-deploys on push to `main`.

## Domains & DNS

- **App**: wordwise.kovina.org
- **DNS**: Cloudflare, CNAME proxied → wordwisehiccups.vercel.app
- **CF token**: `$CLOUDFLARE_API_TOKEN` in `.zshrc` (Zone:DNS:Edit scope)
