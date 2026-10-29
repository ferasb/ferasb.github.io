# ferasbisharat.com

My landing page: a short intro, my CV and my projects. Plain HTML and CSS, no build step, served by GitHub Pages from the root of `main`.

## Editing

- **The page:** `index.html` and `style.css`, set in Inter, with the system's monospace for labels. The hero has the name, set large in Bricolage Grotesque, a one-line role under it, a short intro and the links.
- **The colors:** the top of `style.css` overrides `theme.css`'s surfaces, text, lines and accent for this site only: a deep cobalt blue with a gold accent (every button is gold), and in the light theme the same as ink on parchment: a warm cream page with cobalt text and accent. The `theme-color` tags in `index.html` copy its `--bg`.
- **The background:** worn paint, darkest at the bottom corners. Soft lighter and darker patches of the blue (CSS gradients on `body`); deeper ink and paler steel patches that drift and turn very slowly (`html::before`); cracks and scratches drawn in `cracks.svg`, which `body::before` and `::after` use as a mask, so their colors come from the tokens; and a constellation (`background.js`): small points drifting slowly, each fading through grey, gold, red and green at its own pace (`--dot-1` to `--dot-4` in `style.css`), joined by faint lines in their colors while they're near each other, and linking to the mouse pointer and drifting away from it when it comes close, fainter behind the text than at the sides. With reduced motion turned on, nothing moves and the constellation is drawn still. There's no pause button.
- **The palette:** `theme.css`, the colors of all my sites, light and dark. It's the original: [Bloch Sphere](https://github.com/ferasb/bloch-sphere) and [rekt](https://github.com/ferasb/rekt) each keep a copy in `web/src/theme.css`, so change it here first, then copy it over.
- **Light and dark:** the page follows the system's theme until the visitor picks one with the button at the top (`theme.js`), which the browser remembers. The browser bar's color (the `theme-color` tags in `index.html`, copies of `--bg`) follows the pick too.
- **The Email button** opens a card with the address, a Copy button (`email.js`), a mail button that opens the visitor's mail app, and a short note. It's a popover, so it opens and closes without JavaScript; only Copy needs it.
- **The CV:** replace `Feras-Bisharat-CV.pdf` with the new version, keeping the name, so links to it keep working.
- **Scrolling:** each project fades and rises in as it scrolls into view (CSS scroll-driven animations; browsers without them, and reduced motion, just show it).
- **The clips:** hovering a project's screenshot with a mouse plays a few seconds of the app in use (`img/bloch-sphere-demo.mp4`, `img/rekt-demo.mp4`) over it (`clips.js`), in the dark theme only, since they were recorded in it. They load only when first hovered. On phones, in the light theme, with reduced motion or without JavaScript, the screenshot stays. To make one: record the app in the dark theme, then crop it to 16:9, scale to 1280×720 and drop the sound with ffmpeg (`-vf crop=…,scale=1280:720,setsar=1 -an -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart`).
- **A new project:** copy an `<article class="project">` block inside `<section class="projects">` in `index.html` and bump its number. On wide screens each project is a row, the screenshot beside the text, alternating sides; on narrow ones the screenshot sits above. Screenshots go in `img/` as WebP, one light and one dark, each at 1280×720 and as a 720×405 `-720` copy, listed in the `<img>`'s `srcset`: the browser picks the size for the space and the screen.
- **Link previews:** `og.jpg` (1200×630) is the picture shown when the site is shared on LinkedIn, WhatsApp, X and the like: the name, the role and the address over the page's background (cobalt, cracks, a still constellation), rendered with ffmpeg from the site's fonts and `cracks.svg`.
- **Search engines:** `robots.txt` and `sitemap.xml`, and a JSON-LD block in `index.html` that tells search engines the site, LinkedIn and GitHub are the same person.
- **Icons:** `favicon.svg` is "FB" traced from Inter Bold, in the dark theme's gold on its cobalt. `favicon.ico` and `apple-touch-icon.png` are rendered from it, for browsers and phones that don't use SVG icons.

To preview, run `python3 -m http.server` here and open http://localhost:8000. Pushing to `main` publishes within a minute or two.

## Hosting

- `CNAME` tells GitHub Pages the domain (`ferasbisharat.com`); `www.ferasbisharat.com` redirects to it.
- `.nojekyll` turns off Jekyll: the files are served as they are.
- DNS is at Porkbun: `A`/`AAAA` records for the bare domain and a `CNAME` for `www`, all pointing at GitHub Pages. Subdomains such as `bloch-sphere.ferasbisharat.com` are a `CNAME` to `ferasb.github.io`, plus the custom domain set in that repository's Pages settings.
- There are no cookies, analytics or third-party requests. The Content Security Policy in each page's `<meta>` tag only allows files from this site.

The fonts are self-hosted in `fonts/`, each under the SIL Open Font License (its `OFL-*.txt` beside it): Inter for the text, Bricolage Grotesque for the name, and the projects' own wordmark faces for their titles, so each looks as it does in its app: Michroma for Bloch Sphere (in capitals, spaced) and Bungee for rekt (with the red dot).
