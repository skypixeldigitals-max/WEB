// Remove em-dashes from visible copy; make "View Gallery" a bordered button with
// an arrow; swap the contact button's dash-line for an arrow.
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..");
const files = ["index.html", "portfolio.html", "about.html"];

const repl = [
  // --- em-dash removals (visible copy) ---
  ["across Sri Lanka — architecture &amp; interiors, food, aerial, landscapes.",
   "across Sri Lanka. Architecture &amp; interiors, food, aerial, landscapes."],
  [" — precision in every frame.", ". Precision in every frame."],
  ["photographing — family villas", "photographing: family villas"],
  ["Sri Lanka — available world-wide", "Sri Lanka, available world-wide"],

  // --- View Gallery button: subtle text link -> bordered button (more pop) ---
  ['bracket-link font-label-caps text-label-caps text-primary uppercase tracking-widest hover:opacity-70 transition-opacity',
   'group inline-flex items-center gap-2 border border-primary px-6 py-3 font-label-caps text-label-caps text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300'],
  ['type="button">View Gallery</button>',
   'type="button">View Gallery <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span></button>'],

  // --- contact button dash-line -> arrow ---
  ['<span class="w-8 h-px bg-white transition-all duration-300 group-hover:w-14"></span>',
   '<span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>'],
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
  console.log(f.padEnd(16), total, "replacements");
}
