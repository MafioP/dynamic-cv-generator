# Worklog

Chronological log of changes made to this project with Claude Code's help.

## 2026-08-24

- Added `CLAUDE.md` documenting build/test commands and the architecture (component/service wiring, content model, and the hand-rolled jsPDF export logic in `CvPreviewComponent`).
- Added skill auto-detection: `src/app/utils/skill-extractor.ts` scans the CV content JSON (`content-en.json`/`content-de.json`) for dictionary skills mentioned in the about/experience/project/education text, and `InputFormComponent` highlights matching tags in the skill picker (green ring + checkmark) as suggestions. Nothing is auto-selected — the user still picks manually.
- Confirmed `npm test` was already broken before this work (Karma config in `angular.json` points at wrong relative paths for the jspdf scripts) — out of scope for now, the project never had real test coverage beyond CLI-generated boilerplate specs.
