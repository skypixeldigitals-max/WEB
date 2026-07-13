// One-off literal-string tweaks: trim redundant "Galle" from three names,
// and drop "video"/"products" from body copy + SEO meta (photography focus).
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
const files = ["index.html", "portfolio.html", "about.html", "js/gallery-data.js"];

const repl = [
  ["Armitage Hill Galle", "Armitage Hill"],
  ["Landesi Galle", "Landesi"],
  ["Le Grand Galle", "Le Grand"],
  // Footer paragraph (all pages)
  [
    "Commercial photography &amp; video for brands across Sri Lanka. Architecture &amp; interiors, food, aerial, landscapes and products — precision in every frame.",
    "Commercial photography for brands across Sri Lanka. Architecture &amp; interiors, food, aerial and landscapes — precision in every frame.",
  ],
  // About specialties
  [
    "Architecture &amp; Interiors, Aerial, Food, Landscapes, Products, Video",
    "Architecture &amp; Interiors, Aerial, Food, Landscapes",
  ],
  // index meta description
  [
    "Commercial photography and video by Shakir Jamaldeen — architecture &amp; interiors, food, aerial, landscapes and products, for brands across Sri Lanka.",
    "Commercial photography by Shakir Jamaldeen — architecture &amp; interiors, food, aerial and landscapes, for brands across Sri Lanka.",
  ],
  // index og:description
  [
    "Commercial photography and video for brands across Sri Lanka — architecture, interiors, food, aerial, landscapes and products.",
    "Commercial photography for brands across Sri Lanka — architecture, interiors, food, aerial and landscapes.",
  ],
];

for (const f of files) {
  const p = path.join(dir, f);
  let h = fs.readFileSync(p, "utf8");
  let total = 0;
  for (const [a, b] of repl) {
    const c = h.split(a).length - 1;
    if (c) { h = h.split(a).join(b); total += c; }
  }
  fs.writeFileSync(p, h);
  console.log(f.padEnd(20), total, "replacements");
}
