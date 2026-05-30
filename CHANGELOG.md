# Changelog

All notable changes to WordWise will be documented in this file.

## [3.1.0] — 2026-05-30

### Added
- Desktop timezone bar: 12 global business timezones (PT/MT/CT/ET/BRT/GMT/CET/GST/PKT/IST/CST/JST) with live times
- Timezone hover tooltips: city, state/province, country info + fun fact per timezone
- Date hover tooltip: weird/interesting historical fact about today's date
- Mobile opposite-timezone clocks (IST→EST fixed, EST→IST fixed, others randomized)
- Today's date display on both desktop and mobile
- Smooth tooltip transitions (opacity + transform)
- `user-select: none` on timezone bar to prevent text selection
- `pointer-events: auto` on hoverable elements inside the non-interactive bar

### Changed
- City labels in tooltips now show full city, state/province, country format
- Tooltip text now wraps instead of overflowing (max-width 360px, `white-space: normal`)
- README completely rewritten with full feature documentation, architecture diagram, and timezone table

## [3.0.0] — 2026-05-30

### Added
- Pexels API integration for landscape nature backgrounds
- Random mix of full-screen photos and video backgrounds (50/50)
- AGPL-3.0 license
- Professional README with badges, feature table, API docs, screenshots
- CHANGELOG.md, CONTRIBUTING.md, SECURITY.md
- MIT → AGPL-3.0 license change
- GitHub repo topics (8 tags)
- Repository description and homepage URL
- CI workflow (GitHub Actions — syntax check + smoke test)
- Dependabot for weekly npm updates
- Main branch protection (force push/deletion blocked, CI required)
- Screenshot assets for README hero
- Open Graph tags for social sharing (`og:image`, `twitter:card`)
- SVG + PNG favicons

### Changed
- Background system rewritten to support both photo and video types
- API response now includes `background`, `backgroundType`, `photographer`, and `photoUrl` fields
- Package version bumped to 3.0.0

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
