# Studio Method: The Creative Director's AI Playbook

Source repository for the Studio Method guide — a practical playbook for running a creative studio with AI.

## What's in this repo

- `ebook/playbook.html` — source content for the PDF guide
- `.github/workflows/release.yml` — generates PDF + uploads to GitHub Release and Cloudflare R2 on tag push
- `.github/workflows/compile-ebook.yml` — auto-compiles PDF to `public/guide.pdf` on every push to main

## How to release a new version

```bash
git tag v1.x
git push origin v1.x
```

This triggers the release workflow which:
1. Injects the version number into the PDF cover and footer
2. Generates `playbook-v1.x.pdf` using Vivliostyle
3. Uploads it to Cloudflare R2 at `studio-method/playbook-v1.x.pdf`
4. Creates a GitHub Release with the PDF attached

## PDF delivery

After release, the PDF lives in two places:
- **GitHub Release** — attached to the release on this repo
- **Cloudflare R2** — `openclaw` bucket at key `studio-method/playbook-{version}.pdf`

To serve the PDF publicly via R2, enable the `r2.dev` subdomain in the Cloudflare dashboard under R2 → openclaw bucket → Settings → Public Access. Once enabled, the public URL will be:
`https://pub-<hash>.r2.dev/studio-method/playbook-{version}.pdf`
