# Architecture

WordWise is a minimal vocabulary application — a single Express.js server that serves a word-of-the-day page, an archive page, and a JSON API.

See [architecture.md](architecture.md) for the full system architecture and data flow documentation.

## Overview

```
Browser → Express.js Server → views/index.html
                           → views/archive.html
                           → /api/word → word data
```

## Route Design

| Path | Method | Description |
|------|--------|-------------|
| `/` | GET | Word of the day HTML page |
| `/archive` | GET | Past words HTML page |
| `/api/word` | GET | Word data as JSON |

## Key Design Decisions

1. **No database** — Word data is served from flat files, making deployment trivial.
2. **No authentication** — WordWise has no user accounts, sessions, or personal data.
3. **In-memory cache** — Dictionary results are cached to reduce external API calls.
4. **Vercel-ready** — Configured for serverless deployment via `vercel.json`.

## Data Flow

```
Visitor opens page
        │
        ▼
Browser loads index.html
  • Timezone bar renders instantly
  • Mobile clock renders instantly
  • Starts 4s fallback timer
  • Fetches /api/word
        │
        ▼
Server receives request
  • Checks in-memory cache
  • 50% chance: serve cached word (instant)
  • Otherwise:
    1. Pick random word from 20k pool
    2. Fetch definition from Free Dictionary API
    3. Cache the result
    4. Fetch random Pexels background (3s timeout)
  • Return JSON to client
        │
        ▼
Client renders
  • Cancel fallback timer
  • Word in huge centered text
  • Phonetic + definition below
  • Play button if audio exists
  • Full-screen video or photo background
  • Photographer credit
```
