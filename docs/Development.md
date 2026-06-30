# Development

## Prerequisites

- **Node.js 18+** (native `fetch` support required)
- **npm**

## Setup

```bash
git clone https://github.com/sparshsam/wordwise.git
cd wordwise
npm install
```

## Running Locally

```bash
npm start
```

Open http://localhost:3000.

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port |
| `PEXELS_API_KEY` | No | Embedded key | Your own Pexels API key for background media |

## Code Style

- Keep it simple — no build steps, no frameworks beyond Express
- Use `const`/`let`, `async/await`, and modern Node.js (18+)
- Format readable code; no auto-formatter required

## Project Structure

```
wordwise/
├── docs/                          # Documentation
│   ├── Architecture.md
│   ├── Contributing.md
│   ├── Deployment.md
│   ├── Development.md
│   └── Testing.md
├── routes/
│   └── word.js                    # Word selection, dictionary lookup, Pexels fetch
├── views/
│   ├── index.html                 # Main page (inline CSS + JS)
│   └── archive.html               # Archive placeholder
├── public/
│   ├── favicon.svg                # SVG favicon
│   ├── favicon.png                # PNG fallback favicon
│   └── og-image.png               # Open Graph social preview image
├── assets/
│   ├── hero/hero.png              # README hero screenshot
│   ├── branding/icon.svg          # Brand icon
│   ├── branding/og-image.png      # OG image asset
│   ├── gallery/                   # Screenshot gallery
│   ├── screenshots/               # Legacy screenshots
│   ├── icons/                     # App icons
│   └── screenshot-main.svg        # Vector fallback
├── words.json                     # 30 curated fallback words
├── words.txt                      # 20,000-word pool (~190 KB)
├── server.js                      # Express entry point
├── vercel.json                    # Vercel deployment config
├── package.json
├── LICENSE                        # AGPL-3.0
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── .github/
    ├── dependabot.yml
    └── workflows/
        └── ci.yml                 # Lint + smoke-test pipeline
```
