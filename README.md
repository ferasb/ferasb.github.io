# ferasbisharat.com

My landing page: a short intro, my CV and my projects. Plain HTML and CSS, no build step, served by GitHub Pages from the root of `main`.

## Editing

- **The page:** `index.html` and `style.css`, set in Inter (self-hosted in `fonts/`).
- **The palette:** `theme.css`, the colors of all my sites, light and dark. It's the original: [Bloch Sphere](https://github.com/ferasb/bloch-sphere) keeps a copy in `web/src/theme.css`, so change it here first, then copy it over.
- **Light and dark:** the page follows the system's theme until the visitor picks one with the button at the top (`theme.js`), which the browser remembers. The browser bar's color (the `theme-color` tags in `index.html`, copies of `--bg`) follows the pick too.
- **The Email button** opens a card with the address, a Copy button (`email.js`), a mail button that opens the visitor's mail app, and a short note. It's a popover, so it opens and closes without JavaScript; only Copy needs it.
- **The CV:** replace `Feras-Bisharat-CV.pdf` with the new version, keeping the name, so links to it keep working.
- **A new project:** copy an `<article class="project">` block inside `<div class="projects" data-carousel>` in `index.html`. Screenshots go in `img/` as WebP, one light and one dark, each at 1280×720 and as a 720×405 `-720` copy, listed in the `<img>`'s `srcset`: the browser picks the size for the space and the screen.
- **The projects ring** (`projects.js`): the articles become a 3D ring of cards, the screenshots, that turns slowly and stops while the visitor hovers, drags, swipes, clicks an arrow or a dot, or presses ← →; the pause button stops it until pressed again. The front project's article shows under the ring. With fewer than six projects each appears more than once, so the ring looks full. Without JavaScript, or with reduced motion turned on, the articles are shown as a plain list.
- **Link previews:** `og.jpg` (1200×630) is the picture shown when the site is shared on LinkedIn, WhatsApp, X and the like.
- **Search engines:** `robots.txt` and `sitemap.xml`, and a JSON-LD block in `index.html` that tells search engines the site, LinkedIn and GitHub are the same person.
- **Icons:** `favicon.svg` is "FB" traced from Inter Bold. `favicon.ico` and `apple-touch-icon.png` are rendered from it, for browsers and phones that don't use SVG icons.

To preview, run `python3 -m http.server` here and open http://localhost:8000. Pushing to `main` publishes within a minute or two.

## Hosting

- `CNAME` tells GitHub Pages the domain (`ferasbisharat.com`); `www.ferasbisharat.com` redirects to it.
- `.nojekyll` turns off Jekyll: the files are served as they are.
- DNS is at Porkbun: `A`/`AAAA` records for the bare domain and a `CNAME` for `www`, all pointing at GitHub Pages. Subdomains such as `bloch-sphere.ferasbisharat.com` are a `CNAME` to `ferasb.github.io`, plus the custom domain set in that repository's Pages settings.
- There are no cookies, analytics or third-party requests. The Content Security Policy in each page's `<meta>` tag only allows files from this site.

The Inter font is under the SIL Open Font License (`fonts/OFL.txt`).
