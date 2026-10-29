# ferasbisharat.com

My landing page: a short intro, my CV and my projects. Plain HTML, CSS and JavaScript with no build step, served by GitHub Pages from the root of `main`. `README.md` says how each part works; read it before changing structure. The projects are their own repositories and subdomains (`../bloch-sphere`, `../rekt`).

## Layout

- `index.html`: the page. The hero (name, role, intro, links), then the projects: `<article class="project">` blocks inside `<section class="projects">`.
- `style.css`: the page's styles, including this site's own colors over `theme.css` (cobalt and gold, at the top) and the background (mottled gradients, and `cracks.svg` as a mask in `body::before`/`::after`). The buttons copy Bloch Sphere's (`bloch-sphere/web/src/styles.css`), so the sites look like one family.
- `theme.css`: the palette, light and dark, shared by all my sites. This is the original; `bloch-sphere/web/src/theme.css` and `rekt/web/src/theme.css` are copies.
- `theme.js`: the visitor's theme pick (localStorage) and the browser bar's color. Loaded in `<head>` without `defer`, so a pick applies before the first paint.
- `background.js`: the background's constellation, drifting points joined by faint lines, changing through grey, gold, red and green (`--dot-1` to `--dot-4`), reaching for and drifting from the mouse pointer, on a canvas it adds; still with reduced motion.
- `clips.js`: plays a project's clip (`img/*-demo.mp4`) over its screenshot while the mouse is on it; dark theme only, not with reduced motion or touch.
- `email.js`: the Email card's Copy button. The card is a popover and opens without JavaScript.
- `cracks.svg`: the background's cracks and scratches; a mask, so only its shapes count.
- `404.html`: served for any missing path, so its links are absolute.
- `img/`: the projects' screenshots and clips. `fonts/`: self-hosted, each with its license: Inter (text), Bricolage Grotesque (the name), Michroma and Bungee (the Bloch Sphere and rekt titles, matching their apps' wordmarks). `Feras-Bisharat-CV.pdf`: the CV, replaced in place under the same name.
- `og.jpg` (link previews), the favicons, `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll`.

## Commands

- `python3 -m http.server`: preview on http://localhost:8000
- No build or tests. Pushing to `main` publishes within a minute or two.

## Rules

- **Nothing from other sites.** No third-party scripts, fonts, analytics or requests, and no inline `<script>`, `<style>` or `style=""`: the Content Security Policy in each page's `<meta>` tag allows only this site's files (the JSON-LD block is data, never run). The footer promises no cookies or tracking.
- **Colors are tokens** from `theme.css`, light and dark (`light-dark()`), with this site's own surfaces and accent overriding them at the top of `style.css`. Don't hard-code colors; where a file can't read the tokens (the `theme-color` tags, `favicon.svg`, and the rendered `favicon.ico`, `apple-touch-icon.png` and `og.jpg`), it copies the values and says which. Change the shared palette in `theme.css` first, then copy the file to Bloch Sphere and rekt; the overrides in `style.css` are this site's alone.
- **The HTML is the page.** Scripts only add to it (Copy, the theme button, the constellation, the clips); without them everything still reads and works.
- **Respect reduced motion.** The background's drifting patches and constellation keep moving with no pause control, a deliberate choice (it falls short of WCAG 2.2.2); with reduced motion, nothing moves. Keep background motion slow and faint.
- **Screenshots come in fours**: light and dark, each at 1280×720 and as a 720×405 `-720` copy, as WebP in each `<img>`'s `srcset`. Clips: a few seconds, 1280×720, H.264 MP4 without sound, recorded in the dark theme and cropped to match, small enough to commit (well under 1 MB); the CSP allows them with `media-src 'self'`.
- **Narrow screens work.** `body` is at most 1280px wide, with 16px padding at the sides on phones. From 900px each project puts its screenshot beside its text, alternating sides; below that it's one column. Check at phone width (390px) and on a wide desktop.
- **Keep the README current.** It explains each part in plain words; a change to how something works updates it.
