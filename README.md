# Shakir Jamaldeen — Portfolio Site

Static rebuild of the Stitch "Architectural Narrative" design with corrected, real content.
Reference for verbatim copy/testimonials: `../leona-properties/shakir-jamaldeen-content-audit.md`

Three pages: `index.html` (home), `portfolio.html` (all 17 properties), `about.html` (bio + contact).

## Build

```
npx tailwindcss -c tailwind.config.js -i src/input.css -o css/style.css --minify
```

Re-run after editing any `.html` file — `tailwind.config.js` scans `index.html`, `portfolio.html`
and `about.html` for classes to emit.

## Preview locally

```
npx serve . -l 5510
```

## Deploy (Netlify)

Drag-drop the folder at https://app.netlify.com/drop — needs `index.html`, `portfolio.html`,
`about.html`, `css/`, `js/`, `images/` (~70 MB total, mostly the 240 gallery photos). Do NOT deploy
`node_modules/`, `_sheets/`, `_portfolio-sections.html`, or `contact-sheet.jpg` (dev-only, gitignored).

## Images

- **Homepage** (5 hero + 6 project cards) — mapping in `scripts/optimize.js`. Card 3 uses
  `images/portfolio/cape-waligama-1.jpg` (its original photo, DSC_1072, wasn't in any property folder).
- **Portfolio previews** (2 per property × 17) — mapping in `scripts/optimize-portfolio.js`,
  selections recorded in `scripts/portfolio-manifest.json`. Chosen by visually reviewing contact
  sheets (`scripts/property-sheets.js`), not guessed from filenames.
- **Full galleries** (240 photos, ~64 MB) — `scripts/optimize-galleries.js` optimizes EVERY photo in
  each property folder into `images/gallery/<slug>/NN.jpg` and regenerates `js/gallery-data.js`.
- **Logo** — `images/logo.png`, the geometric cat mark, trimmed via `scripts/logo.js`.

To swap an image: edit the relevant script's file mapping, re-run it, then re-run the Tailwind build
if you also touched HTML.

## Portfolio page is generated — don't edit it by hand

`portfolio.html` is built by `scripts/build-portfolio.js` from `portfolio-manifest.json` +
`js/gallery-data.js`. To change a section, edit the script/manifest and re-run:

```
node scripts/build-portfolio.js && npx tailwindcss -c tailwind.config.js -i src/input.css -o css/style.css --minify
```

## Gallery lightbox

Each portfolio section has clickable preview photos and a `[ VIEW GALLERY — N PHOTOS ]` link that
open a fullscreen lightbox (arrows, keyboard ←/→/Esc, swipe on touch, counter, adjacent-image
preloading). Homepage project cards deep-link to `portfolio.html#<slug>`. A `pageshow` handler
closes any stale lightbox on back/forward-cache restores.

## ⚠️ Known gaps

1. **Food & product photography** — none of the 17 property folders contained food/product shots,
   so those categories are absent from both the homepage filter chips and the portfolio page.
   Add a folder + section when that shoot comes in.
2. **Two location-uncertain properties** — "Artotel Sanur" and "Ayr Castle" are confirmed real
   Sri Lankan shoots (per Devike), but those exact names also match real places elsewhere (Sanur,
   Bali; Ayr, Scotland) — so their portfolio captions omit a specific location rather than guess.
   Add one if/when confirmed.
3. **Portfolio project descriptions** are intentionally short and factual (name · location ·
   category) per instruction — no invented editorial copy, unlike the original Stitch draft.
4. **Contact form** is a `mailto:` button, not a backend-processed form (static site, no server).

## Already fixed vs. the Stitch export

- Real contact everywhere: +94 77 753 6266 / shakir.jamaldeen@gmail.com (was fake London/NY details)
- Real socials: Instagram / Facebook / Behance (was dead LinkedIn/Journal/Twitter links)
- Real bio on About page, verbatim from Shakir's own site (was fake "decade+ experience... operates
  from New York" plus fabricated awards: AIA Media Award, Phaidon, Monocle Top 50, AD100 — all removed)
- Real project names for all 17 properties, real photography (was 3 placeholder AI-generated projects)
- Testimonials: verbatim & correctly attributed (Swanthri's had been rewritten with an invented line)
- Removed: fake "150+ international projects" claim, © 2024 (now © 2026)
- Sharp 0px corners throughout, matching the design system doc (one Stitch draft had drifted to rounded)
- Tailwind compiled locally (was the non-production play CDN); font fallback `cursive` → `sans-serif`
- Mobile menu works on all 3 pages; nav links point to real pages, not dead anchors

## Git

Repo pushed to `github.com/skypixeldigitals-max/WEB` (remote name is `orgin`, a typo for `origin` —
cosmetic only, works fine either way). Commits after 2026-07-10 are authored as "Devike". The very
first commit ("test") predates that fix and includes `node_modules/` in its history — left alone
per instruction; a later commit untracked it so it won't recur.
