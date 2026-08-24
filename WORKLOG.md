# Worklog

Chronological log of changes made to this project with Claude Code's help.

## 2026-08-24

- Added `CLAUDE.md` documenting build/test commands and the architecture (component/service wiring, content model, and the hand-rolled jsPDF export logic in `CvPreviewComponent`).
- Added skill auto-detection: `src/app/utils/skill-extractor.ts` scans the CV content JSON (`content-en.json`/`content-de.json`) for dictionary skills mentioned in the about/experience/project/education text, and `InputFormComponent` highlights matching tags in the skill picker (green ring + checkmark) as suggestions. Nothing is auto-selected — the user still picks manually.
- Confirmed `npm test` was already broken before this work (Karma config in `angular.json` points at wrong relative paths for the jspdf scripts) — out of scope for now, the project never had real test coverage beyond CLI-generated boilerplate specs.
- Redesigned the skill picker (`InputFormComponent`): the flat dictionary moved to `src/app/data/skill-categories.ts`, grouped into categories (Languages, Frameworks & Libraries, Web, Databases, Platforms & Tools, Practices, Other) rendered under headers. Detected-from-CV skills now get their own pinned "Suggested from your CV" section at the top instead of just an inline marker. The separate "add a custom skill" input was replaced with a single search/add field: typing filters the visible tags live, and Enter either toggles an exact dictionary match or adds the typed text as a new skill under a "Custom" category and selects it. Verified visually with a headless-Chromium screenshot pass (filtering, add-new-skill, and the resulting CV preview update all confirmed working).
