# WordWise — Claude Code Instructions

## Overview

Reflective word-of-the-day practice. Node.js + Express.  
Production: https://wordwise.kovina.org (Vercel)

## Commands

```bash
npm start              # Run server locally (port 3000)
vercel --prod          # Deploy to Vercel production
git push origin main   # Auto-deploys via Vercel Git integration
```

## Architecture

- **Daily batch system**: 50 unique words per day, date-seeded deterministically (Mulberry32 PRNG on `YYYY-MM-DD` seed)
- **Slot tracking**: Each visitor progresses through the pool via `localStorage` (`wordwise_slot` + `wordwise_day`)
- **Media pre-fetch**: First request of the day triggers async background fetch of 50 Pexels media URLs (50:50 video/photo)
- **Cache layers**: In-memory `defCache` (Dictionary API results) + `mediaCache` (Pexels URLs) — per serverless instance
- **No external DB**: Deterministic from date seed + in-memory caches

## Key files

| File | Purpose |
|------|---------|
| `routes/word.js` | Daily batch generation, word serving, media pre-fetch |
| `views/index.html` | Client with timezone bar, word display, background media |
| `words.json` | 31 curated words with definitions (fallback for rare words) |
| `words.txt` | 20K+ English word pool for daily selection |

## API

### GET /api/word?slot=N

Returns the Nth word from today's deterministic 50-word batch.

Response: `{ word, phonetic, definition, example, partOfSpeech, audioUrl, background?, backgroundType?, photographer?, photoUrl?, nextSlot }`

- `slot` defaults to 0 if omitted/invalid; wraps at 49 → nextSlot: 0
- Media comes from pre-fetched Pexels cache or fetched on-demand

## Deployment

- **Domain**: wordwise.kovina.org (Cloudflare proxied → Vercel)
- **Vercel project**: `wordwise` under `sparsh-sams-projects` team
- **Project ID**: `prj_ytl2Hm76xJYVrolTa8cnhsjBJAwa`
- **DNS**: CNAME `wordwise` → `wordwisehiccups.vercel.app` (proxied, Cloudflare)
- **Cloudflare zone**: kovina.org (NS: steven.ns.cloudflare.com / roxy.ns.cloudflare.com)
- Domain added via: `vercel domain add wordwise.kovina.org wordwise --scope sparsh-sams-projects`

## Branch protection

`main` requires 1 approving review, dismisses stale reviews, enforces for admins. No force pushes or deletions.

## 2026-07-03 — Icon Generation & Branding Session

### Icon Assets (115 total from `wordwise_light_mode.png`)
- **Windows**: Multi-size ICO (16×16–256×256)
- **MSIX Store**: 11 asset types × 5 scales (50px–800px)
- **Android**: mipmap-hdpi through xxxhdpi + adaptive icons
- **iOS**: App icon set (20pt–1024pt)
- **macOS**: `.iconset` (16×16–512×512@2x)
- **Web**: favicon.ico + favicon-16×16 + favicon-32×32 + apple-touch-icon
- **PWA**: 192×192 + 512×512 manifest icons
- **Social**: OG image (1200×630) + GitHub avatars + header icon

### Branding
- README header: app icon (72px centered) from `assets/branding/icon.png`
- Kovina wordmark logo added to footer (bottom-left, hyperlinked to kovina.org)

### Favicon Migration (SVG -> PNG)
- Removed `favicon.svg`, replaced with real PNG favicons generated from master source
- Enforced PNG favicon references in `views/index.html` and `views/archive.html`
- OG image regenerated at 1200×630

## Environment variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `PEXELS_API_KEY` | Hardcoded fallback in code | Pexels API for background media |
| `CLOUDFLARE_API_TOKEN` | `~/.zshrc` | Cloudflare DNS management |
