# ferasbisharat.com

My landing page: a short intro, my CV and my projects. Plain HTML and CSS, no build step, served by GitHub Pages from the root of `main`.

## Editing

- **The page:** `index.html` and `style.css`, set in Inter (self-hosted in `fonts/`).
- **The palette:** `theme.css`, the colors of all my sites, light and dark. It's the original: [Bloch Sphere](https://github.com/ferasb/bloch-sphere) keeps a copy in `web/src/theme.css`, so change it here first, then copy it over.
- **Light and dark:** the page follows the system's theme until the visitor picks one with the button at the top (`theme.js`), which the browser remembers.
- **The Email button** opens a card with the address, a Copy button (`email.js`), a mail button that opens the visitor's mail app, and a short note. It's a popover, so it opens and closes without JavaScript; only Copy needs it.
- **The CV:** replace `Feras-Bisharat-CV.pdf` with the new version, keeping the name, so links to it keep working.
- **A new project:** copy the `<article class="project">` block in `index.html`. Screenshots go in `img/` as WebP, 1280×720, one light and one dark.
- **Icons:** `favicon.svg` is "FB" traced from Inter Bold. `favicon.ico` and `apple-touch-icon.png` are rendered from it, for browsers and phones that don't use SVG icons.

To preview, run `python3 -m http.server` here and open http://localhost:8000. Pushing to `main` publishes within a minute or two.

## Hosting

- `CNAME` tells GitHub Pages the domain (`ferasbisharat.com`); `www.ferasbisharat.com` redirects to it.
- `.nojekyll` turns off Jekyll: the files are served as they are.
- DNS is at Porkbun: `A`/`AAAA` records for the bare domain and a `CNAME` for `www`, all pointing at GitHub Pages. Subdomains such as `bloch-sphere.ferasbisharat.com` are a `CNAME` to `ferasb.github.io`, plus the custom domain set in that repository's Pages settings.
- There are no cookies, analytics or third-party requests. The Content Security Policy in each page's `<meta>` tag only allows files from this site.

The Inter font is under the SIL Open Font License (`fonts/OFL.txt`).
