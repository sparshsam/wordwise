<p align="center">
  <img alt="WordWise" src="assets/screenshot-main.png" width="720">
</p>

<h1 align="center">WordWise</h1>

<p align="center">
  A word every visit, rendered huge over a full-screen background.
  <br>
  Built for curiosity, aesthetics, and zero friction.
</p>

<p align="center">
  <a href="https://wordwisehiccups.vercel.app"><strong>Live Demo →</strong></a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#how-it-works">How It Works</a>
  ·
  <a href="#api">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node >=18">
  <img src="https://img.shields.io/badge/license-AGPL--3.0-blue" alt="AGPL-3.0">
  <img src="https://img.shields.io/github/last-commit/sparshsam/wordwise" alt="Last commit">
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
</p>

---

WordWise is a single-page word-of-the-day app that serves a random English word on every visit — with its definition, phonetic pronunciation, a usage example, and a full-screen nature landscape photo or video background. It started as a hardcoded demo and grew into a polished, deployable product.

---

## Features

### 📖 Word Engine
| | Detail |
|---|---|
| **Word pool** | 20,000+ common English words (3–12 letters), bundled as a flat file |
| **Curated fallback** | 30 hand-picked words with pre-written definitions — always servable |
| **Dictionary API** | On-the-fly lookups from the [Free Dictionary API](https://dictionaryapi.dev/), cached in memory |
| **Audio** | Pronunciation play button when the dictionary provides an audio file |
| **Safety** | All dictionary text escapes HTML before rendering (XSS protection) |

### 🖼️ Background Media
| | Detail |
|---|---|
| **Source** | [Pexels API](https://pexels.com/api) — free, no rate limits on the free plan |
| **Content** | Nature landscape photos and videos, searched with `orientation=landscape` |
| **Mix** | 50/50 random between photo and video on each request |
| **Quality** | Highest resolution available (original for photos, UHD for videos) |
| **Fallback** | If one type fails, the other serves as backup |
| **Attribution** | Photographer/videographer name linked to original Pexels page |

### 🕐 Timezone Bar — Desktop
A thin glass-blur strip across the top of the screen showing the current time in 12 major business timezones:

| Abbr | City, State, Country | Fun Fact |
|---|---|---|
| **PT** | Los Angeles, California, USA | Home to Silicon Valley and Hollywood |
| **MT** | Denver, Colorado, USA | Only U.S. city to host the Olympics at a mile high |
| **CT** | Chicago, Illinois, USA | Invented the skyscraper and the brownie |
| **ET** | New York, New York, USA | NYSE opens at 9:30 ET — busiest trading hour on Earth |
| **BRT** | São Paulo, SP, Brazil | Largest city in the Americas outside North America |
| **GMT** | London, England, UK | World's timekeeping zero — all timezones measured against it |
| **CET** | Berlin, Germany | DST transition affects most of Europe |
| **GST** | Dubai, UAE | No daylight saving — sunrise barely shifts year-round |
| **PKT** | Karachi, Sindh, Pakistan | One of few countries using a 30-minute offset |
| **IST** | Mumbai, Maharashtra, India | Single timezone for 1.4 billion people |
| **CST** | Beijing, China | Spans 5 geographic timezones but uses only one |
| **JST** | Tokyo, Japan | Timezone unchanged since 1888 |

- **Hover** any timezone → a smooth tooltip fades in with the city, state/province, country and a fun fact about that timezone
- **Date on the right** → hover for a weird historical fact about that day in history
- Times update every 30 seconds

### 📱 Mobile Clock
On phones (<768px), the timezone bar hides and a compact clock appears in the top-right corner showing:
- Today's date
- The user's **opposite timezone** time (IST→EST fixed, EST→IST fixed, everyone else gets randomized)

### 🌐 Cross-Platform
- **iOS Safari**: Dynamic viewport height (`100dvh`), safe area insets for notch phones, `viewport-fit=cover`, touch target minimum 44px, `-webkit-text-size-adjust`
- **Android Chrome**: Overscroll prevention, tap highlight removal, sans-serif font stack
- **Desktop**: Hover-only tooltips, wider timezone bar, keyboard accessible
- **Reduced motion**: `prefers-reduced-motion` disables transitions
- **Responsive layout**: Clamp-based font sizing scales from 3.5rem to 10rem

### 🛡️ Reliability
- **4-second client fallback**: If the API doesn't respond in 4s, a pre-bundled word renders automatically
- **Server timeouts**: All outbound API calls use `AbortController` with 3–4 second timeouts
- **Graceful degradation**: Failed background → just the word. Failed dictionary → curated word. Everything fails → em-dash
- **3 attempts max** for dictionary lookups before falling back to curated words

### 📦 Deployment
- One-command Vercel deploy via included `vercel.json`
- CI pipeline (`lint-and-test` check) + Dependabot for npm updates
- Main branch protected — force pushes and deletions blocked, status checks required

### 🔒 Privacy
- Zero cookies, zero analytics, zero tracking scripts
- No authentication, no user accounts, no data storage
- Outbound requests only to Free Dictionary API and Pexels API
- Full AGPL-3.0 source

---

## How It Works

```
Visitor opens page
        │
        ▼
┌─────────────────────────────────────┐
│  Browser loads index.html           │
│  • Timezone bar renders instantly   │
│  • Mobile clock renders instantly   │
│  • Starts 4s fallback timer         │
│  • Fetches /api/word                │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Server receives request            │
│  • Checks in-memory cache           │
│  • 50% chance: serve cached word    │
│    (instant, no external calls)     │
│  • Otherwise:                       │
│    1. Pick random word from 20k     │
│    2. Fetch definition from DictAPI │
│    3. Cache the result              │
│    4. Fetch random Pexels bg (3s)   │
│  • Return JSON to client            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Client renders                     │
│  • Cancel fallback timer            │
│  • Word in huge centered text       │
│  • Phonetic + definition below      │
│  • Play button if audio exists      │
│  • Full-screen video or photo bg    │
│  • Photographer credit              │
└─────────────────────────────────────┘
```

If the API takes longer than 4 seconds (cold start, slow network), the fallback timer fires and renders a curated word from memory immediately.

---

## API

### `GET /api/word`

Returns a random word with definition and background media.

**Response:**

```json
{
  "word": "serendipity",
  "phonetic": "/ˌsɛrənˈdɪpɪti/",
  "definition": "the occurrence of events by chance in a happy way",
  "example": "Finding that book was pure serendipity.",
  "partOfSpeech": "noun",
  "audioUrl": null,
  "background": "https://images.pexels.com/photos/...",
  "backgroundType": "photo",
  "photographer": "Jane Doe",
  "photoUrl": "https://pexels.com/photo/..."
}
```

| Field | Type | Description |
|---|---|---|
| `word` | string | The word |
| `phonetic` | string | Pronunciation (may be empty) |
| `definition` | string | Short definition |
| `example` | string | Usage example (may be empty) |
| `partOfSpeech` | string | e.g. "noun", "adjective", "verb" |
| `audioUrl` | string\|null | Pronunciation audio URL |
| `background` | string\|null | Full-resolution photo/video URL |
| `backgroundType` | string | `"photo"` or `"video"` |
| `photographer` | string\|null | Creator name |
| `photoUrl` | string\|null | Link to original Pexels page |

---

## Getting Started

### Prerequisites

- **Node.js 18+** (native `fetch` support required)
- **npm**

### Install & Run

```bash
git clone https://github.com/sparshsam/wordwise.git
cd wordwise
npm install
npm start
```

Open http://localhost:3000.

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

The `vercel.json` routes all requests to the Express server.

### Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port |
| `PEXELS_API_KEY` | No | Embedded key | Your own Pexels API key for background media |

---

## Project Structure

```
wordwise/
├── routes/
│   └── word.js              # Word selection, dictionary lookup, Pexels fetch
├── views/
│   ├── index.html            # Main page (inline CSS + JS)
│   └── archive.html          # Archive placeholder
├── public/
│   ├── favicon.svg           # SVG favicon
│   ├── favicon.png           # PNG fallback favicon
│   └── og-image.png          # Open Graph social preview image
├── assets/
│   ├── screenshot-main.png   # README hero screenshot
│   └── screenshot-main.svg   # Vector fallback
├── words.json                # 30 curated fallback words
├── words.txt                 # 20,000-word pool (~190 KB)
├── server.js                 # Express entry point
├── vercel.json               # Vercel deployment config
├── package.json
├── LICENSE                   # AGPL-3.0
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── .github/
    ├── dependabot.yml
    └── workflows/
        └── ci.yml            # Lint + smoke-test pipeline
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express 4 |
| **Dictionary** | [Free Dictionary API](https://dictionaryapi.dev/) |
| **Media** | [Pexels API](https://pexels.com/api) |
| **Deployment** | Vercel (serverless Node — `@vercel/node`) |
| **CI** | GitHub Actions (syntax check + curl smoke test) |

---

## Security

- **No user data** is collected, stored, or transmitted in any form
- **No cookies**, no analytics, no tracking scripts of any kind
- **No authentication** — the app is fully read-only; there is nothing to log into
- **Outbound requests** are limited to two services: Free Dictionary API (word definitions) and Pexels API (photo/video URLs)
- **Input handling**: All dictionary content is sanitized through `escapeHtml()` before rendering to prevent XSS from API responses
- **API key**: Embedded Pexels key has read-only access to public assets only

See [SECURITY.md](SECURITY.md) for the full policy.

---

## Deployment Notes

- **Platform**: Vercel (primary, tested). Works on any Node.js host — Railway, Render, Fly.io, your own VPS.
- **Cold starts**: First hit after inactivity takes 1–4s (serverless cold start + API calls). The 4s fallback ensures the user always sees something.
- **Memory**: The 20,000-word pool uses ~190 KB on disk. The in-memory cache grows with unique word lookups; expect ~100–300 MB under normal use.
- **Branch protection**: Main branch requires `lint-and-test` CI check to pass. Force pushes and deletions blocked.

---

## Roadmap

- [x] Random word with dictionary definitions
- [x] Landscape nature photo/video backgrounds
- [x] Audio pronunciation support
- [x] Desktop timezone bar with hover tooltips
- [x] Mobile opposite-timezone display
- [x] Date hover with historical facts
- [x] One-click Vercel deployment
- [ ] Daily word archive (past words logged and browsable)
- [ ] Share-once link for a specific word with pinned background
- [ ] User-chosen overlay opacity
- [ ] Word frequency filter (common words only mode)
- [ ] Self-hosted dictionary (remove external API dependency)

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, code style, and pull request guidelines.

## License

AGPL-3.0. See [LICENSE](LICENSE) for details.
