# Shakir Jamaldeen — Portfolio (homepage)

Static rebuild of the Stitch "Architectural Narrative" homepage with corrected content.
Reference for all real copy: `../leona-properties/shakir-jamaldeen-content-audit.md`

## Build

```
npx tailwindcss -c tailwind.config.js -i src/input.css -o css/style.css --minify
```

Re-run after editing `index.html` (Tailwind only emits classes it finds there).

## Preview locally

```
npx serve . -l 5510
```

## Deploy (Netlify)

Drag-drop the folder at https://app.netlify.com/drop — only `index.html` and `css/` are needed
(plus `images/` once populated). Do NOT deploy `node_modules/`.

## Images

The 11 project/hero photos are real, self-hosted and web-optimized in `images/`.
Source → slot mapping lives in `scripts/optimize.js`; to regenerate, drop new files in the
source folder, edit the MAP, and run `node scripts/optimize.js`.

## ⚠️ Before real launch

1. **Food & product photos** — none were in the supplied batch, so cards 4/5 and the category filters
   currently show interiors/architecture. Add food/product shots later to restore those categories.
2. **Project titles** — titles ("Resort Architecture", "Poolside Villa", etc.) are neutral placeholders.
   Replace with real project/client names when known.
3. **ABOUT nav link** — currently anchors to the testimonials section; point at `about.html` when built.

## Logo

`images/logo.png` — the geometric cat mark (transparent PNG, trimmed via `scripts/logo.js`).
Used in the nav (with "SHAKIR JAMALDEEN" wordmark) and footer.

## Already fixed vs. the Stitch export

- Real contact: +94 77 753 6266 / shakir.jamaldeen@gmail.com (was fake London/NY details)
- Real socials: Instagram / Facebook / Behance (was dead LinkedIn/Journal links)
- Positioning: Sri Lanka commercial photography incl. food/aerial/products/video (was "fine art, London to New York")
- Testimonials: all 5 verbatim & correctly attributed (Swanthri's had been rewritten)
- Removed: fake "150+ international projects", fake project locations (Scotland/Bali), © 2024
- Tailwind compiled locally (was the non-production play CDN); font fallback `cursive` → `sans-serif`
- Mobile menu button now works; testimonial slide count derived from markup
