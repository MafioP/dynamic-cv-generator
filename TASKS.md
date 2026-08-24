# Tasks

Backlog of things to do on this project. Move an item to `worklog.md` (with a short entry) once it's done.

## Open

- (none yet — add feature ideas here as they come up)

## Known issues (deprioritized)

- `npm test` fails to launch Karma: `angular.json`'s `test.options.scripts` references `../node_modules/jspdf/dist/jspdf.min.js` and `../node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js` with wrong relative paths, and the existing specs are just CLI-generated boilerplate. Ignoring for now per project owner — this is a simple project without a real test suite.

## Done

- [x] Document the codebase in `CLAUDE.md`.
- [x] Auto-detect skills mentioned in the CV content and highlight them as suggestions in the skill picker.
