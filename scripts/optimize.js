// Resize + compress the chosen source photos into web-ready JPEGs in /images.
// Placements are fixed by the HTML; this only maps each slot to a source file.
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/admin/Downloads/CODE/shakir website images";
const OUT = path.join(__dirname, "..", "images");

// slot -> source file + resize box (fit:inside preserves aspect; CSS object-cover
// does the final crop to each slot's ratio). Heroes get a height cap + lower q
// because they're full-bleed and some are portrait/foliage-heavy (compress poorly).
const MAP = [
  // Hero slideshow (full-bleed)
  { src: "DJI_20250109092244_0068_D-3266.jpg", out: "hero-1.jpg", w: 2400, h: 1600, q: 74 }, // aerial resort
  { src: "SJP_2917-4293.jpg",                   out: "hero-2.jpg", w: 2400, h: 1600, q: 74 }, // living room / jungle window
  { src: "SJP_8131-3243.jpg",                   out: "hero-3.jpg", w: 2400, h: 1600, q: 74 }, // infinity pool resort
  { src: "DSC_0245-3278.jpg",                   out: "hero-4.jpg", w: 2400, h: 1600, q: 74 }, // corridor framing the sea
  { src: "SJP_3091-4270.jpg",                   out: "hero-5.jpg", w: 2400, h: 1600, q: 72 }, // pool through trees

  // Project cards
  { src: "@shakir.jamaldeen-5787.jpg", out: "project-1-architecture.jpg", w: 2000, q: 80 }, // 16:9 timber building
  { src: "DJI_20250109091943_0063_D-3265.jpg", out: "project-2-aerial.jpg", w: 1200, q: 80 }, // 4:5 coastal aerial
  { src: "DSC_1072.jpg",               out: "project-3-poolvilla.jpg", w: 2000, q: 80 }, // 21:9 pool villa
  { src: "SJP_2283-859.jpg",           out: "project-4-suite.jpg", w: 1400, q: 80 },   // 4:3 four-poster suite
  { src: "SJP_2933-4291.jpg",          out: "project-5-living.jpg", w: 1400, q: 80 },  // 4:3 living room + art
  { src: "DSC_1036.jpg",               out: "project-6-villa.jpg", w: 2000, q: 80 },   // 21:9 pool villa
];

(async () => {
  let total = 0;
  for (const m of MAP) {
    const info = await sharp(path.join(SRC, m.src))
      .rotate() // respect EXIF orientation
      .resize({ width: m.w, height: m.h, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: m.q, progressive: true, mozjpeg: true })
      .toFile(path.join(OUT, m.out));
    const kb = Math.round(info.size / 1024);
    total += info.size;
    console.log(`${m.out.padEnd(30)} ${info.width}x${info.height}  ${kb} KB`);
  }
  console.log(`\nTotal: ${Math.round(total / 1024)} KB across ${MAP.length} images`);
})();
