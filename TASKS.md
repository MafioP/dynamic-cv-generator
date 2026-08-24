# Tasks

Backlog of things to do on this project. Move an item to `WORKLOG.md` (with a short entry) once it's done.

## Open

- [ ] Make CV content editable in the UI (large task, tackled in steps — persistence: localStorage + export/import JSON):
  - [x] Step 1: `CvContentService` — owns `{ en: ResumeData, de: ResumeData }` behind a BehaviorSubject, seeded from `content-en.json`/`content-de.json` or localStorage if present; persists on every update. Refactored `CvPreviewComponent` and `InputFormComponent` to read from it instead of importing the JSON files directly (read-only wiring, no editor UI yet).
  - [x] Step 2 + 3: `CvEditorComponent` — collapsible "Edit CV Content" panel below the preview, per-language tabs (EN/DE, both drafts kept in memory so switching tabs doesn't lose edits), a form for contact details, about, section headings, experiences (add/remove, details as one-bullet-per-line), education, projects (add/remove), and the languages/soft-skills/other string lists (add/remove). Save commits the active language's draft to `CvContentService` (live preview update); Discard reverts it; Reset to Default reloads the bundled JSON. Also added Download/Import JSON backup buttons wired to `exportAsJSON`/`importFromJSON`.
  - [x] Step 4a: Reordering (up/down) for experiences, education, projects, and the languages/soft-skills/other lists. Merged the skill picker (formerly `InputFormComponent`) directly into `CvEditorComponent` so it's one component. Every field group (skills, contact, about, headings, experience, education, projects, languages, soft skills, other) is now independently collapsible, all expanded by default. Education changed from a single object to a repeatable list with add/remove/reorder, matching experiences/projects.
  - [x] Step 4b: Fixed a reorder bug (duplicated text instead of swapping — caused by `<form>` + index-based `name` bindings, fixed by dropping the `<form>` wrapper and all `name` attributes). Switched from explicit Save/Discard to live sync (every edit pushes to `CvContentService` immediately, matching the skill picker's existing instant-update feel); kept Reset to Default with a `confirm()` guard since it's now immediately destructive. Moved "Select CV Languages" + Download PDF out of the Skills section into their own always-visible bar at the top of the panel.
  - [ ] Step 4c: Remaining polish — inline validation (e.g. required name/email).

## Known issues (deprioritized)

- `npm test` fails to launch Karma: `angular.json`'s `test.options.scripts` references `../node_modules/jspdf/dist/jspdf.min.js` and `../node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js` with wrong relative paths, and the existing specs are just CLI-generated boilerplate. Ignoring for now per project owner — this is a simple project without a real test suite.

## Done

- [x] Document the codebase in `CLAUDE.md`.
- [x] Auto-detect skills mentioned in the CV content and highlight them as suggestions in the skill picker.
- [x] Redesign the skill picker: categorized skill groups, a pinned "Suggested from your CV" section, and a combined search/add field.
- [x] Fixed a focus-loss bug when typing in Languages Spoken/Soft Skills/Other (missing `*ngFor` `trackBy` on primitive-array lists).
- [x] Persist selected skills (`CvService`) to localStorage, same pattern as CV content — survives a page reload, including custom (non-dictionary) skills, which get restored into the picker as a "Custom" category.
