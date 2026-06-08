# Deployment

## Local Development

```bash
npm install
npm start
```

The server runs on `http://localhost:3000`.

## Production (Vercel)

```bash
npx vercel --prod
```

No environment variables are required. The application is self-contained and ready to deploy.

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
