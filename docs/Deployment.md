# Deployment

## Local Development

```bash
npm install
npm start
```

The server runs on `http://localhost:3000`.

## Production (Vercel)

Deploy with a single command:

```bash
npm i -g vercel
vercel --prod
```

The included `vercel.json` routes all requests to the Express server. No environment variables are required — the application is self-contained.

## Production (Self-Hosted)

```bash
npm install
npm start
```

For a production Node.js deployment, consider using a process manager:

```bash
npm install -g pm2
pm2 start server.js --name wordwise
```

## Platform Notes

- **Primary**: Vercel (tested and recommended)
- **Alternatives**: Railway, Render, Fly.io, any Node.js host
- **Cold starts**: First hit after inactivity takes 1–4s (serverless cold start + API calls). The 4s fallback timer ensures the user always sees something.
- **Memory**: The 20,000-word pool uses ~190 KB on disk. In-memory cache grows with unique word lookups; expect ~100–300 MB under normal use.
