# Security Policy

## Scope

This covers the WordWise application and its deployment at https://wordwisehiccups.vercel.app.

WordWise is a read-only word-of-the-day app. It does not:

- Collect, store, or transmit personal data
- Use cookies or tracking
- Require authentication or user accounts
- Accept user input that gets stored or processed server-side

## External Dependencies

The app makes outbound requests to:

- **Free Dictionary API** (`api.dictionaryapi.dev`) — word definitions
- **Pexels API** (`api.pexels.com`) — background photo/video URLs

No user data is sent to these services.

## API Key

The Pexels API key is embedded in the server code. It has read-only access to public assets. If you deploy your own instance, you can use a different key or set the `PEXELS_API_KEY` environment variable.

## Reporting a Vulnerability

This project has a small surface area, but if you find a security issue:

1. **Do not** open a public GitHub issue
2. Email: nexusoc@agentmail.to

You should receive a response within 72 hours.

## Responsible Disclosure

We ask that you give us reasonable time to address any reported issues before public disclosure.
