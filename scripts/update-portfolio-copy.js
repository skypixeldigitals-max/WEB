// One-off: update portfolio subtitles (City, Country · Type), drop photo counts
// from View Gallery buttons, and humanize the intro copy.
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "..", "portfolio.html");
let html = fs.readFileSync(FILE, "utf8");

// 1) "View Gallery — 18 Photos" -> "View Gallery"
html = html.replace(/View Gallery — \d+ Photos/g, "View Gallery");

// 2) Humanized intro
html = html.replace(
  /Seventeen properties across Sri Lanka[\s\S]*?full gallery\./,
  "These are the places I've had the pleasure of photographing — family villas, boutique hotels and quiet hideaways across Sri Lanka, from the hill country to the coast. Have a look inside any of them."
);

// 3) Subtitles: slug -> "City, Sri Lanka · Type" (&amp; encoded)
const SUB = {
  "aaathma": "Sri Lanka · Interiors",
  "armitage-hill-galle": "Galle, Sri Lanka · Architecture &amp; Interiors",
  "artotel-sanur": "Sri Lanka · Interiors",
  "ayr-castle": "Padukka, Sri Lanka · Architecture &amp; Interiors",
  "cape-waligama": "Weligama, Sri Lanka · Aerial &amp; Interiors",
  "helios-boutique-villa": "Ahangama, Sri Lanka · Architecture &amp; Interiors",
  "kalkudah-beach-house": "Kalkudah, Sri Lanka · Aerial &amp; Architecture",
  "landesi-galle": "Galle, Sri Lanka · Interiors",
  "le-grand-galle": "Galle, Sri Lanka · Aerial &amp; Architecture",
  "leela-walauwwa": "Induruwa, Sri Lanka · Architecture &amp; Interiors",
  "mayur-lodge": "Tissamaharama, Sri Lanka · Aerial &amp; Interiors",
  "nine-skies": "Ella, Sri Lanka · Aerial &amp; Landscapes",
  "on-the-rocks": "Unawatuna, Sri Lanka · Aerial &amp; Architecture",
  "rock-villa": "Bentota, Sri Lanka · Aerial &amp; Landscapes",
  "solar-crab": "Negombo, Sri Lanka · Architecture &amp; Interiors",
  "sun-house": "Galle, Sri Lanka · Aerial &amp; Architecture",
  "why-house": "Galle, Sri Lanka · Aerial &amp; Interiors",
};

let replaced = 0;
for (const [slug, text] of Object.entries(SUB)) {
  const re = new RegExp('(id="' + slug + '"[\\s\\S]*?tracking-\\[0\\.2em\\] font-bold uppercase mb-6">)([^<]*)(</p>)');
  const before = html;
  html = html.replace(re, "$1" + text + "$3");
  if (html !== before) replaced++;
  else console.warn("NO MATCH for", slug);
}

fs.writeFileSync(FILE, html);
console.log("Subtitles replaced:", replaced + "/17");
console.log("Remaining photo-count buttons:", (html.match(/View Gallery — \d+ Photos/g) || []).length);
console.log("View Gallery buttons total:", (html.match(/>View Gallery</g) || []).length);
