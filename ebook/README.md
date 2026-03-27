# The Creative Director's AI Playbook — Ebook

## Authoring Workflow

Content lives in `playbook.md` (Markdown). The build script converts it to `playbook.html` (generated, not committed), which is then compiled to PDF by GitHub Actions.

```
playbook.md  →  build.js  →  playbook.html  →  (CI) playbook.pdf
```

## Files

| File | Description |
|------|-------------|
| `playbook.md` | **Edit this** — all authored content in Markdown |
| `template.html` | HTML shell with CSS + `{{CONTENT}}` placeholder |
| `build.js` | Node.js build script (no dependencies) |
| `playbook.html` | Generated HTML (in `.gitignore`, never commit) |
| `playbook.pdf` | Auto-generated PDF in `public/guide.pdf` (CI only) |

## Editing Content

1. Edit `ebook/playbook.md` with your changes
2. Run `node ebook/build.js` to regenerate `playbook.html` locally
3. Open `ebook/playbook.html` in a browser to preview
4. Commit **only** `playbook.md` (do NOT commit `playbook.html`)
5. Push to `main` — GitHub Actions runs `build.js` and generates the PDF automatically

## Markdown Syntax

### Intro block (the "Before We Start" page)

```markdown
:::intro{quote="The quote text here"}
Body paragraph one.

Body paragraph two.
:::
```

### Chapter blocks

```markdown
:::chapter{number="01" label="Chapter One"}
# Chapter Title

Chapter intro text (appears on the dark cover page).

## Section Heading

Body paragraph text. Each `##` heading starts a new alternating-background section.

### Subsection heading

More body text.

:::pull-quote
"Quote text here"
:::

:::stats
- 90 | Minutes to write weekly status — before
- 20 | Minutes to review and add narrative — after
- 5× | Faster. Same information. Less friction.
:::

:::col-list
- **Term** | Definition text here
- **Another term** | Another definition
:::

:::field{title="What Good Looks Like"}
A brief that generates zero follow-up questions...
:::

:::
```

### Closing block

```markdown
:::closing
# The Studio That Runs Itself

Closing body text...
:::
```

## Build Script Details

`build.js` reads `playbook.md` and `template.html`, converts the custom Markdown blocks to HTML, and writes `playbook.html`. It runs without any npm dependencies (Node.js stdlib only).

**Validation:** If `playbook.html` already exists, the script compares element counts (h2 headings, pull-quotes, stat blocks, col-lists, body-sections, chapter covers, field blocks) between the new and previous output and warns if counts differ by more than 5%.

## Local Preview

```bash
node ebook/build.js
open ebook/playbook.html
```

To generate PDF locally (requires Chrome):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --print-to-pdf=ebook/playbook.pdf --print-to-pdf-no-header \
  "file://$(pwd)/ebook/playbook.html"
```

## Version Numbering

Update the version string in `template.html` cover page:

```html
<span style="...">Version 2.0 · March 2026</span>
```

**Version format:** MAJOR.MINOR.PATCH
- Patch: typo/formatting fix
- Minor: new section within a chapter
- Major: new chapter or structural change

## Current Version

**v2.0.0** — March 2026
Full guide: all 7 chapters + Appendix A/B/C + Closing
