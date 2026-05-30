# Changelog

All notable changes to WordWise will be documented in this file.

## [3.0.0] — 2026-05-30

### Added
- Pexels API integration for landscape nature backgrounds
- Random mix of full-screen photos and video backgrounds (50/50)
- Photographer/videographer attribution in bottom-right corner
- Dark overlay for text readability on variable backgrounds

### Changed
- Background system rewritten to support both photo and video types
- API response now includes `background`, `backgroundType`, `photographer`, and `photoUrl` fields

## [2.0.0] — 2026-05-30

### Added
- 30 curated words with definitions, phonetics, and usage examples
- 20,000-word fallback pool for extended variety
- Free Dictionary API integration for on-demand word lookups
- In-memory result caching for fast repeat loads
- Minimal, centered layout with large typography

### Changed
- Complete redesign from hardcoded single-word demo to dynamic word-of-the-day
- Background changed from white to dark with subtle styling

## [1.0.0] — 2025-07-06

### Added
- Initial release with Express.js server
- Hardcoded "ephemeral" word of the day
- Static HTML view with word, definition, example, and audio playback
- Vercel deployment configuration
