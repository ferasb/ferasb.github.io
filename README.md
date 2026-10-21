# ferasbisharat.com

My landing page: a short intro, my CV and my projects. Plain HTML and CSS, no build step, served by GitHub Pages from the root of `main`.

## Editing

- **The page:** `index.html` and `style.css`. Colors and fonts follow [Bloch Sphere](https://github.com/ferasb/bloch-sphere)'s tokens.
- **The CV:** replace `Feras-Bisharat-CV.pdf` with the new version, keeping the name, so links to it keep working.
- **A new project:** copy the `<article class="project">` block in `index.html`. Screenshots go in `img/` as WebP, 1280×720.

To preview, run `python3 -m http.server` here and open http://localhost:8000. Pushing to `main` publishes within a minute or two.

## Hosting

- `CNAME` tells GitHub Pages the domain (`ferasbisharat.com`); `www.ferasbisharat.com` redirects to it.
- `.nojekyll` turns off Jekyll: the files are served as they are.
- DNS is at Porkbun: `A`/`AAAA` records for the bare domain and a `CNAME` for `www`, all pointing at GitHub Pages. Subdomains such as `bloch-sphere.ferasbisharat.com` are a `CNAME` to `ferasb.github.io`, plus the custom domain set in that repository's Pages settings.
- There are no cookies, analytics or third-party requests. The Content Security Policy in each page's `<meta>` tag only allows files from this site.

The Michroma font is under the SIL Open Font License (`fonts/OFL.txt`).
