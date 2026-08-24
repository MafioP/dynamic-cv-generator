# Tasks

Backlog of things to do on this project. Move an item to `WORKLOG.md` (with a short entry) once it's done.

## Open

- [ ] Make CV content editable in the UI (large task, tackled in steps — persistence: localStorage + export/import JSON):
  - [x] Step 1: `CvContentService` — owns `{ en: ResumeData, de: ResumeData }` behind a BehaviorSubject, seeded from `content-en.json`/`content-de.json` or localStorage if present; persists on every update. Refactored `CvPreviewComponent` and `InputFormComponent` to read from it instead of importing the JSON files directly (read-only wiring, no editor UI yet).
  - [ ] Step 2: Editing UI — a form (per-language) for contact details, about, experiences, education, projects, languages, soft skills, other — bound to the service.
  - [ ] Step 3: Export (download JSON) / import (upload JSON) buttons wired to the service.
  - [ ] Step 4: Polish — add/remove/reorder entries in list sections (experiences, projects), a "reset to default" action, basic validation.

## Known issues (deprioritized)

- `npm test` fails to launch Karma: `angular.json`'s `test.options.scripts` references `../node_modules/jspdf/dist/jspdf.min.js` and `../node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js` with wrong relative paths, and the existing specs are just CLI-generated boilerplate. Ignoring for now per project owner — this is a simple project without a real test suite.

## Done

- [x] Document the codebase in `CLAUDE.md`.
- [x] Auto-detect skills mentioned in the CV content and highlight them as suggestions in the skill picker.
- [x] Redesign the skill picker: categorized skill groups, a pinned "Suggested from your CV" section, and a combined search/add field.
