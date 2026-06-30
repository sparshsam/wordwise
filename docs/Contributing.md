# Contributing to WordWise

Thanks for your interest! This is a small project, but contributions are welcome.

See [CONTRIBUTING.md](../CONTRIBUTING.md) at the project root for the full contributing guide and links to related documentation.

## How to Contribute

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feat/my-change`)
3. **Make your changes**
4. **Test locally** (`npm start`, then open http://localhost:3000)
5. **Commit** with a clear message
6. **Push** and open a Pull Request

## Quick Links

- [Development Setup](Development.md)
- [Architecture](Architecture.md)
- [Deployment](Deployment.md)
- [Testing](Testing.md)

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

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.
