# Architecture

## Overview

WordWise is a minimal vocabulary application. A single Express.js server serves a word-of-the-day page, an archive page, and a JSON API.

```mermaid
flowchart LR
    B[Browser] --> S[Express.js Server]
    S --> R1[views/index.html]
    S --> R2[views/archive.html]
    S --> API[/api/word]
    API --> WD[word data]
```

## Route Design

| Path | Method | Description |
|------|--------|-------------|
| `/` | GET | Word of the day HTML page |
| `/archive` | GET | Past words HTML page |
| `/api/word` | GET | Word data as JSON |

## Data Structure

The word API returns:

```json
{
    "date": "2025-07-06",
    "word": "ephemeral",
    "definition": "lasting for a very short time",
    "example": "Life is as ephemeral as morning dew.",
    "audioUrl": "/audio/ephemeral.mp3"
}
```

## Design Decisions

1. **No database** — Word data is currently served from the route definition, making deployment trivial.
2. **No authentication** — WordWise has no user accounts, sessions, or personal data.
3. **Static audio** — Pronunciation files are served from the `public/` directory.
4. **Vercel-ready** — The Express server is configured for Vercel serverless deployment via `vercel.json`.

## Future Expansion

Word data can be migrated to a JSON file, a database, or an API source without changing the frontend or API contract.
