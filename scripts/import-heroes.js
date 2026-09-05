// Imports the client's new hero images from images/_incoming into the homepage
// slideshow, and re-encodes the four kept originals, all as WebP.
//
//   node scripts/import-heroes.js            # dry run
//   node scripts/import-heroes.js --write    # encode + rewrite index.html
//
// Existing JPEGs are left on disk: about.html still uses hero-2.jpg for its
// social preview, and they are the outputs of optimize-heroes.js.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const WRITE = process.argv.includes("--write");

// Final slideshow order. `src` is relative to images/.
const ORDER = [
  { src: "hero-1.jpg",  alt: "Aerial view of a cliffside villa pool above the ocean, Sri Lanka" },
  { src: "hero-5.jpg",  alt: "Aerial top-down view of a villa and pool" },
  { src: "hero-9.jpg",  alt: "Villa pool with a parasol" },
  { src: "hero-12.jpg", alt: "Arched timber doors along a villa courtyard" },
  { src: "_incoming/Copy of DSC_1473.jpg",                          out: 14, alt: "Bronze sculptures winding along a curved interior staircase" },
  { src: "_incoming/Copy of DJI_20260422182118_0112_D.jpg",         out: 15, alt: "Aerial view of a beachfront villa at sunset, Sri Lanka" },
  { src: "_incoming/Copy of DJI_20260420153840_0010_D-10119 (1).jpg", out: 16, alt: "Aerial view of a palm-fringed beach and villa, Sri Lanka" },
  { src: "_incoming/Copy of DJI_20260227074203_0342_D.jpg",         out: 17, alt: "Boat on a still river at dawn, hill country Sri Lanka" },
  { src: "_incoming/SJP_1998-8931.jpg",                             out: 18, alt: "Colonnaded courtyard with a lily pond and lanterns at dusk" },
  { src: "_incoming/Copy of SJP_0095.jpg",                          out: 19, alt: "Lantern-lit colonial courtyard with cafe tables, Galle" },
  { src: "_incoming/Copy of SJP_0004-2.jpg",                        out: 20, alt: "Dining hall with a chequerboard floor and timber beams" },
  { src: "_incoming/DJI_20260220184124_0180_D.jpg",                 out: 21, alt: "Camel rider on desert dunes at dawn, Oman" },
];

(async () => {
  const slides = [];
  let total = 0;

  for (let i = 0; i < ORDER.length; i++) {
    const item = ORDER[i];
    const n = item.out || +item.src.match(/hero-(\d+)/)[1];
    const outName = `hero-${n}.webp`;

    if (WRITE) {
      const info = await sharp(path.join(ROOT, "images", item.src))
        .rotate()
        .resize({ width: 2560, height: 1707, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(path.join(ROOT, "images", outName));
      total += info.size;
      console.log(`${String(i + 1).padStart(2)}. ${outName.padEnd(14)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
    } else {
      console.log(`${String(i + 1).padStart(2)}. ${item.src}  ->  ${outName}`);
    }

    // Only the first slide loads eagerly; the rest are swapped in by the slideshow.
    const attr = i === 0
      ? `src="images/${outName}" fetchpriority="high"`
      : `data-src="images/${outName}"`;
    slides.push(
      `            <div class="hero-slide absolute inset-0">\r\n` +
      `                <img alt="${item.alt}" class="w-full h-full object-cover" ${attr}>\r\n` +
      `            </div>`
    );
  }

  if (!WRITE) return console.log("\nDry run. Re-run with --write to apply.");

  const html = fs.readFileSync(INDEX, "utf8");
  const re = /(\r?\n[ \t]*<div class="hero-slide absolute inset-0">[\s\S]*?<\/div>)+(?=\r?\n[ \t]*<div class="absolute inset-0 pointer-events-none)/;
  if (!re.test(html)) throw new Error("Could not locate the existing hero slides.");
  fs.writeFileSync(INDEX, html.replace(re, "\r\n" + slides.join("\r\n")));
  console.log(`\n${slides.length} slides written to index.html — ${Math.round(total / 1024)}KB total`);
})();
