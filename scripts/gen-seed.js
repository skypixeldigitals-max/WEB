// Generates SQL to seed the 17 existing properties + their images into Supabase.
// Metadata comes from the map below; image lists come from js/gallery-data.js.
const fs = require("fs");
const path = require("path");

// Load window.GALLERIES from the existing gallery-data.js
const galleryJs = fs.readFileSync(path.join(__dirname, "..", "js", "gallery-data.js"), "utf8");
const window = {};
eval(galleryJs); // defines window.GALLERIES
const G = window.GALLERIES;

// slug -> [name, location]  (order = display order)
const META = [
  ["aaathma", "Aaathma", "Sri Jayawardenepura Kotte, Sri Lanka"],
  ["armitage-hill-galle", "Armitage Hill", "Galle, Sri Lanka"],
  ["artotel-sanur", "Artotel Sanur", "Bali, Indonesia"],
  ["ayr-castle", "Ayr Castle", "Padukka, Sri Lanka"],
  ["cape-waligama", "Cape Weligama", "Weligama, Sri Lanka"],
  ["helios-boutique-villa", "Helios Boutique Villa", "Ahangama, Sri Lanka"],
  ["kalkudah-beach-house", "Kalkudah Beach House", "Kalkudah, Sri Lanka"],
  ["landesi-galle", "Landesi", "Galle, Sri Lanka"],
  ["le-grand-galle", "Le Grand", "Galle, Sri Lanka"],
  ["leela-walauwwa", "Leela Walauwwa", "Induruwa, Sri Lanka"],
  ["mayur-lodge", "Mayur Lodge", "Tissamaharama, Sri Lanka"],
  ["nine-skies", "Nine Skies", "Ella, Sri Lanka"],
  ["on-the-rocks", "On The Rocks", "Unawatuna, Sri Lanka"],
  ["rock-villa", "Rock Villa", "Bentota, Sri Lanka"],
  ["solar-crab", "Solar Crab", "Negombo, Sri Lanka"],
  ["sun-house", "Sun House", "Galle, Sri Lanka"],
  ["why-house", "Why House", "Galle, Sri Lanka"],
];

const esc = (s) => s.replace(/'/g, "''");

const propRows = META.map(([slug, name, loc], i) =>
  `('${esc(slug)}', '${esc(name)}', '${esc(loc)}', 'published', ${i + 1})`
).join(",\n  ");

let imgVals = [];
for (const [slug] of META) {
  const imgs = (G[slug] && G[slug].images) || [];
  imgs.forEach((url, idx) => imgVals.push(`('${esc(slug)}', '${esc(url)}', ${idx + 1})`));
}

const sql = `insert into public.properties (slug, name, location, status, sort_order) values
  ${propRows};

insert into public.property_images (property_id, url, sort_order)
select p.id, v.url, v.ord
from public.properties p
join (values
  ${imgVals.join(",\n  ")}
) as v(slug, url, ord) on p.slug = v.slug;`;

fs.writeFileSync(path.join(__dirname, "seed.sql"), sql);
console.log("Wrote seed.sql:", META.length, "properties,", imgVals.length, "images");
