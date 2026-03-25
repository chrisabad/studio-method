# The Creative Director's AI Playbook — Ebook

## Files

| File | Description |
|------|-------------|
| `playbook.html` | Source ebook — edit this to update content |
| `playbook.pdf` | Auto-generated PDF (do not edit manually) |

## How to Update Content

1. Edit `ebook/playbook.html`
2. Commit and push to `main`
3. GitHub Actions automatically generates a new `playbook.pdf` and updates `public/guide.pdf`

The PDF on studiomethod.ai updates automatically within ~2 minutes of a push.

## Version Numbering

Update the version in three places in `playbook.html`:

```html
<meta name="version" content="2.0.0">         <!-- Update version -->
<meta name="last-updated" content="2026-03-25"> <!-- Update date -->
...
<span class="spine-version">v2.0.0</span>       <!-- Update spine -->
...
<p class="version-badge">Version 2.0.0 | March 25, 2026</p>  <!-- Update badge -->
```

**Version format:** MAJOR.MINOR.PATCH
- Patch: typo/formatting fix
- Minor: new section within a chapter  
- Major: new chapter or structural change

## Local Preview

Open `ebook/playbook.html` in any browser to preview.

To generate PDF locally (requires Chrome):
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --print-to-pdf=ebook/playbook.pdf --print-to-pdf-no-header \
  "file://$(pwd)/ebook/playbook.html"
```

## Current Version

**v2.0.0** — March 25, 2026  
Full guide: all 7 chapters + Appendix A/B/C + Closing
