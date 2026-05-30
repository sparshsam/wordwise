# Contributing to WordWise

Thanks for your interest! This is a small project, but contributions are welcome.

## How to Contribute

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feat/my-change`)
3. **Make your changes**
4. **Test locally** (`npm start`, then open http://localhost:3000)
5. **Commit** with a clear message
6. **Push** and open a Pull Request

## Development Setup

```bash
git clone https://github.com/sparshsam/wordwise.git
cd wordwise
npm install
npm start
```

The server runs on `http://localhost:3000`.

## Code Style

- Keep it simple — no build steps, no frameworks beyond Express
- Use `const`/`let`, async/await, and modern Node.js (18+)
- Format readable code; no auto-formatter required

## Pull Request Guidelines

- One change per PR
- Update the README if your change affects usage or setup
- Update CHANGELOG.md under `[Unreleased]`
- Test that the API still returns valid JSON and the page renders

## Adding Words

To add curated fallback words, edit `words.json`. Each entry needs:

```json
{
  "word": "example",
  "phonetic": "/ɪɡˈzæmpəl/",
  "definition": "a thing serving as a model",
  "example": "This is an example sentence.",
  "partOfSpeech": "noun"
}
```

## Reporting Issues

Open a GitHub issue with:
- What you expected
- What happened instead
- Steps to reproduce (if applicable)
- Browser/device info (for frontend issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
