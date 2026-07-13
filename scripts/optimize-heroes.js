// Optimizes the curated "Hero images" folder into images/hero-1..N.jpg.
// Order is deliberate (strong aerial opener, then alternating exterior/interior).
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/admin/Downloads/CODE/shakir website images/Hero images";
const OUT = path.join(__dirname, "..", "images");

// display order -> source file
const ORDER = [
  "DJI_20250412072230_0627_D.jpg",   // 1  cliffside villa pool above the ocean
  "DJI_20250109092244_0068_D-3266.jpg", // 2  coastal resort aerial
  "DSC_4541-4048.jpg",               // 3  villa + reflecting pool
  "SJP_5712-4935.jpg",               // 4  villa + pool + garden
  "DJI_20241001081458_0876_D.jpg",   // 5  top-down villa pool
  "@shakir.jamaldeen-5787.jpg",      // 6  timber interior staircase
  "SJP_0493-3655.jpg",               // 7  garden path villa
  "DJI_20250305100539_0170_D-4455.jpg", // 8  villa aerial among palms
  "SJP_8373-1920.jpg",               // 9  villa pool + parasol
  "DSC_0261-3274.jpg",               // 10 minimal interior + still water
  "SJP_3272-1253.jpg",               // 11 colonial villa lawn
  "SJP_0457-2096.jpg",               // 12 arched courtyard doors
  "SJP_3181-4261.jpg",               // 13 pavilion villa lawn
];

(async () => {
  let total = 0;
  for (let i = 0; i < ORDER.length; i++) {
    const info = await sharp(path.join(SRC, ORDER[i]))
      .rotate()
      // Full-bleed hero: high res for retina/large screens + higher quality to kill
      // sky/water banding. Only hero-1 loads eagerly; the rest are lazy-loaded.
      .resize({ width: 3840, height: 2560, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(path.join(OUT, `hero-${i + 1}.jpg`));
    total += info.size;
    console.log(`hero-${i + 1}.jpg`.padEnd(13), info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
  }
  console.log(`\nTotal ${ORDER.length} heroes: ${Math.round(total / 1024)} KB`);
})();
