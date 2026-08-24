# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Angular 15 single-page app for tailoring a CV/resume to a job description. The user picks skills from tags and toggles German/English content, sees a live HTML preview, and exports it to a PDF client-side. There is no backend — all data is static JSON in `src/assets`.

Live deployment: https://mafiop.github.io/dynamic-cv-generator/ (GitHub Pages, built from the `deploy` branch via `.github/workflows/jekyll.yml`).

## Commands

- `npm start` — runs `ng serve` (dev server, default http://localhost:4200)
- `npm run build` — production build (`ng build`, output to `dist/dynamic-cv-generator`)
- `npm run watch` — development-config build in watch mode
- `npm test` — runs Karma/Jasmine unit tests (Chrome launcher)
- Single test file: use Angular CLI's `--include`, e.g. `ng test --include='**/cv.service.spec.ts'`

## Architecture

Everything lives under `src/app`, with three components and two services wired through `AppModule` (no routing — this is a single view).

- **`AppComponent`** — top-level layout. Holds `currentLanguages` state and forwards the "download PDF" button click to `CvPreviewComponent` via `@ViewChild`.
- **`InputFormComponent`** — the skill-tag picker and language checkboxes. Skill selection state lives locally in the component (`selectedSkills`) and is pushed out through `CvService`; language selection is pushed to `AppComponent` via `@Output() languageChange` and passed down into `CvPreviewComponent` as an `@Input`.
- **`CvPreviewComponent`** — renders the CV preview from static JSON and drives PDF export. This is the most complex piece of the codebase.
- **`CvService`** — a `BehaviorSubject<{skills: string[]}>` that's the only channel connecting the input form's selected skills to the preview. Language selection does *not* go through this service — it flows through `@Input`/`@Output` bindings instead. Keep this asymmetry in mind when tracing data flow.
- **`ImageConverterService`** — fetches the profile picture and converts it to base64 for embedding directly into the generated PDF.

### Content model

CV content (experience, education, projects, languages, etc.) lives in `src/assets/content-en.json` and `src/assets/content-de.json`, both shaped by the `ResumeData` interface in `src/app/interfaces/profile.ts`. These are imported directly as ES modules in `cv-preview.component.ts` (`import * as enData from '../../assets/content-en.json'`), not fetched at runtime. Skills selected in the UI are *not* part of this JSON — they come exclusively from `CvService` and get merged with each language's `softSkills` at render time.

When editing CV content, keep both language JSON files structurally in sync — `CvPreviewComponent` assumes both have the same shape and iterates over whichever ones are in `selectedLanguages`.

### PDF generation (`CvPreviewComponent.downloadPDF`)

This is hand-rolled, not a straightforward "print the DOM" export, because `html2pdf.js`/jsPDF's HTML rendering doesn't reliably match the live preview's styling or paginate correctly. The approach:

1. Custom fonts (`src/assets/arial-normal.js`, `src/assets/G_ari_bd-bold.js`) are jsPDF-format font files, imported for side effects so jsPDF can register them.
2. Section headers, the contact block, and skill/language "pill" lists are drawn manually with jsPDF primitives (`doc.text`, `doc.roundedRect`, `doc.line`, etc.) — see `setHeader`, `setContactInfo`, `addHorizontalList`.
3. Larger free-form sections (work experience, projects) are rendered via `doc.html()` on a cloned DOM node whose computed styles are copied inline (`applyStyles`/`getComputedStyles`), since `doc.html()` doesn't inherit page stylesheet rules.
4. Vertical offset (`offsetY`) is tracked and nudged manually between sections, with different fudge factors depending on language (see the `getClonedElementHeight` divisor branching on `en` vs. other languages) because `doc.html()`'s async rendering height isn't known ahead of time.
5. One page is generated per selected language, iterating in the order given by `selectedLanguages`.

This offset math is fragile and tuned by trial and error — if you change fonts, font sizes, section content structure, or the section order in `cv-preview.component.html`, expect to have to re-tune the offsets and re-test the actual PDF output (not just that the code compiles).

The section DOM elements referenced by class name (`contact`, `cv-template-1`, `skills`, `cv-template-2`, `other`) in `downloadPDF`'s `sections` array must correspond to classes actually present in `cv-preview.component.html`; note that `id`/`skills`/`other` are handled specially (drawn manually) rather than pulled from the DOM.
