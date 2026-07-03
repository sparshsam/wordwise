# WordWise — Claude Code Instructions

## Overview

Reflective word-of-the-day practice. Node.js + Express.
Production: https://wordwise.kovina.org (Vercel)

## Commands

npm start         # Run server locally
vercel --prod     # Deploy to production

## Architecture

- Daily batch system: 50 unique words per day, date-seeded deterministically
- Slot tracking: Each visitor progresses through the pool via localStorage
- Media pre-fetch: First request triggers async batch fetch of Pexels media
- Cache layers: In-memory defCache (Dictionary API) + mediaCache (Pexels)
- No external DB: Deterministic from date seed + in-memory caches

## Key files

| File | Purpose |
|------|---------|
| routes/word.js | Daily batch, word serving, media pre-fetch |
| views/index.html | Client with timezone bar, word display, media |
| words.json | Curated word pool (fallback definitions) |
| words.txt | 20K+ word pool for daily selection |

## Deployment

Custom domain on Vercel behind Cloudflare proxy.
