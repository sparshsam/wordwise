<p align="center">
  <img alt="WordWise" src="assets/screenshot-main.svg" width="720">
</p>

<h1 align="center">WordWise</h1>

<p align="center">
  A minimal word-of-the-day app — big typography, beautiful backgrounds.
  <br>
  Every visit reveals a new word with its definition, phonetic pronunciation, and usage example.
</p>

<p align="center">
  <a href="https://wordwisehiccups.vercel.app"><strong>Live Demo →</strong></a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#getting-started">Getting Started</a>
  ·
  <a href="#api">API</a>
  ·
  <a href="#tech-stack">Tech Stack</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node >=18">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
  <img src="https://img.shields.io/github/last-commit/sparshsam/wordwise" alt="Last commit">
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
</p>

---

## Features

| Capability | Detail |
|---|---|
| **Word variety** | 20,000+ word pool + 30 curated fallback words with definitions, phonetics, and examples |
| **Dictionary API** | On-the-fly lookups via the [Free Dictionary API](https://dictionaryapi.dev/) |
| **Background media** | Full-screen landscape nature photos or videos from [Pexels](https://pexels.com), served randomly |
| **Audio pronunciation** | When available from the dictionary, a play button appears below the definition |
| **Photographer credits** | Each background links back to the original Pexels photographer |
| **In-memory cache** | Looked-up words are cached so repeat requests are instant |
| **No JavaScript build step** | Plain Node.js + Express — run it, deploy it, done |
| **Zero tracking** | No cookies, no analytics, no user data collection |
| **One-click deploy** | Vercel-ready with `vercel.json` included |

## How It Works

1. A request hits `GET /api/word`
2. The server picks a random word from the 20,000-word pool
3. It fetches the definition, phonetic, and audio URL from the Free Dictionary API
4. It fetches a random nature landscape photo or video from Pexels
5. It caches the result in-memory for fast repeat loads
6. The client renders the word huge, centered, over a full-screen background

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

Open http://localhost:3000 in your browser.

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

The `vercel.json` in the root handles routing and build configuration automatically.

### Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port |
| `PEXELS_API_KEY` | No | Embedded key | Your own Pexels API key for background media |

The embedded Pexels key has read-only access to public assets. You can replace it with your own free key from [pexels.com/api](https://pexels.com/api).

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
| `word` | string | The word itself |
| `phonetic` | string | Pronunciation (may be empty) |
| `definition` | string | Short definition |
| `example` | string | Usage example (may be empty) |
| `partOfSpeech` | string | e.g. "noun", "adjective", "verb" |
| `audioUrl` | string\|null | Pronunciation audio file URL |
| `background` | string\|null | Full-resolution photo or video URL |
| `backgroundType` | string | `"photo"` or `"video"` |
| `photographer` | string\|null | Creator name for attribution |
| `photoUrl` | string\|null | Link to original Pexels page |

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express 4 |
| **Dictionary** | [Free Dictionary API](https://dictionaryapi.dev/) |
| **Media** | [Pexels API](https://pexels.com/api) |
| **Deployment** | Vercel (serverless Node) |

## Project Structure

```
wordwise/
├── routes/
│   └── word.js          # Word + background logic
├── views/
│   ├── index.html        # Main page
│   └── archive.html      # Archive placeholder
├── assets/               # Screenshots and media
├── words.json            # 30 curated fallback words
├── words.txt             # 20,000-word pool
├── server.js             # Express entry point
├── vercel.json           # Vercel deployment config
├── package.json
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── .github/
    ├── dependabot.yml
    └── workflows/
        └── ci.yml
```

## Security & Privacy

- **No user data** is collected, stored, or transmitted
- **No cookies**, no analytics, no tracking scripts
- **No authentication** — the app is fully read-only
- **Outbound requests** are limited to the Free Dictionary API and Pexels API word definitions and public media URLs

See [SECURITY.md](SECURITY.md) for the full policy.

## Deployment Notes

- **Platforms**: Vercel (primary), any Node.js host (Railway, Render, Fly.io, your own VPS)
- **Memory**: The 20,000-word pool uses ~200 KB. The cache grows with unique word lookups — expect ~100–300 MB under normal use
- **Cold starts**: First request after a period of inactivity triggers dictionary + Pexels API calls (typically 1–3 seconds). Subsequent requests are faster due to caching

## Roadmap

- [x] Random word with dictionary definitions
- [x] Landscape nature photo/video backgrounds
- [x] Audio pronunciation support
- [x] One-click Vercel deployment
- [ ] Daily word archive (past words are logged)
- [ ] Share-once link generation for a specific word
- [ ] Dark/light mode tuneable overlay
- [ ] Word frequency filter (common words only mode)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT. See [LICENSE](LICENSE) for details.
