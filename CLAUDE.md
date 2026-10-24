# ferasbisharat.com

My landing page: a short intro, my CV and my projects. Plain HTML, CSS and JavaScript with no build step, served by GitHub Pages from the root of `main`. `README.md` says how each part works; read it before changing structure. The projects are their own repositories and subdomains (`../bloch-sphere`, `../rekt`).

## Layout

- `index.html`: the page. The projects are `<article class="project">` blocks inside `<div class="projects" data-carousel>`.
- `style.css`: the page's styles. The buttons copy Bloch Sphere's (`bloch-sphere/web/src/styles.css`), so the sites look like one family.
- `theme.css`: the palette, light and dark, shared by all my sites. This is the original; `bloch-sphere/web/src/theme.css` and `rekt/web/src/theme.css` are copies.
- `theme.js`: the visitor's theme pick (localStorage) and the browser bar's color. Loaded in `<head>` without `defer`, so a pick applies before the first paint.
- `email.js`: the Email card's Copy button. The card is a popover and opens without JavaScript.
- `projects.js`: turns the project list into the 3D ring. Without it, or with reduced motion, the list stays.
- `404.html`: served for any missing path, so its links are absolute.
- `img/`: the projects' screenshots. `fonts/`: Inter, self-hosted. `Feras-Bisharat-CV.pdf`: the CV, replaced in place under the same name.
- `og.jpg` (link previews), the favicons, `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll`.

## Commands

- `python3 -m http.server`: preview on http://localhost:8000
- No build or tests. Pushing to `main` publishes within a minute or two.

## Rules

- **Nothing from other sites.** No third-party scripts, fonts, analytics or requests, and no inline `<script>`, `<style>` or `style=""`: the Content Security Policy in each page's `<meta>` tag allows only this site's files (the JSON-LD block is data, never run). The footer promises no cookies or tracking.
- **Colors are tokens** from `theme.css`, light and dark (`light-dark()`). Don't hard-code colors; where a file can't read the tokens (the `theme-color` tags), it copies the values and says which. Change the palette here first, then copy the file to Bloch Sphere and rekt.
- **The HTML is the page.** Scripts only add to it (the ring, Copy, the theme button); without them everything still reads and works.
- **Motion can be stopped.** Respect `prefers-reduced-motion`. Anything that moves for more than five seconds needs a way to stop it (WCAG 2.2.2), and the ring draws only while it moves.
- **Screenshots come in fours**: light and dark, each at 1280×720 and as a 720×405 `-720` copy, as WebP in each `<img>`'s `srcset`. The ring's cards reuse the list's pictures at the list's size: a smaller size would mean a second download on slow connections.
- **Narrow screens work.** One column: `body` is at most 720px wide, with 16px padding at the sides. Check at phone width (390px).
- **Keep the README current.** It explains each part in plain words; a change to how something works updates it.
