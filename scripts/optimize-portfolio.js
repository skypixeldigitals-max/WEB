// Optimizes 2 representative photos per property into images/portfolio/<slug>-1.jpg / -2.jpg.
// Selections made by visually reviewing contact sheets (scripts/property-sheets.js output).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = "C:/Users/admin/Downloads/CODE/shakir website images";
const OUT = path.join(__dirname, "..", "images", "portfolio");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// slug, folder, [file1, file2], location (null = unconfirmed, don't print a place name), category
const PROPERTIES = [
  { slug: "aaathma", folder: "Aaathma", files: ["SJP_6175-HDR-2999.jpg", "SJP_1845-2568.jpg"], location: "Sri Lanka", category: "Interiors" },
  { slug: "armitage-hill-galle", folder: "Armitage Hill Galle", files: ["SJP_3136-4264.jpg", "DSC_7324.jpg"], location: "Galle, Sri Lanka", category: "Architecture & Interiors" },
  { slug: "artotel-sanur", folder: "Artotel Sanur", files: ["@shakir.jamaldeen-5751.jpg", "@shakir.jamaldeen-5975.jpg"], location: null, category: "Interiors" },
  { slug: "ayr-castle", folder: "Ayr Castle", files: ["DJI_20240816160854_0969_D.jpg", "SJP_2402-898.jpg"], location: null, category: "Architecture & Interiors" },
  { slug: "cape-waligama", folder: "Cape Waligama", files: ["DJI_20250412071420_0600_D.jpg", "SJP_8081-5124.jpg"], location: "Weligama, Sri Lanka", category: "Aerial & Interiors" },
  { slug: "helios-boutique-villa", folder: "Helios Boutique Villa", files: ["SJP_0042-3341.jpg", "SJP_0093-3336.jpg"], location: "Sri Lanka", category: "Architecture & Interiors" },
  { slug: "kalkudah-beach-house", folder: "Kalkudah Beach House", files: ["DJI_20250305100539_0170_D-4455.jpg", "DSC_3720.jpg"], location: "Kalkudah, Sri Lanka", category: "Aerial & Architecture" },
  { slug: "landesi-galle", folder: "Landesi Galle", files: ["SJP_0538-2090.jpg", "SJP_0709-2065.jpg"], location: "Galle, Sri Lanka", category: "Interiors" },
  { slug: "le-grand-galle", folder: "Le Grand Galle", files: ["DJI_20250109091943_0063_D-3265.jpg", "SJP_8131-3243.jpg"], location: "Galle, Sri Lanka", category: "Aerial & Architecture" },
  { slug: "leela-walauwwa", folder: "Leela Walauwwa", files: ["SJP_3732-1172.jpg", "SJP_4104-1102.jpg"], location: "Sri Lanka", category: "Architecture & Interiors" },
  { slug: "mayur-lodge", folder: "Mayur Lodge", files: ["DJI_20241005161523_0096_D.jpg", "SJP_1033-2161.jpg"], location: "Sri Lanka", category: "Aerial & Interiors" },
  { slug: "nine-skies", folder: "Nine Skies", files: ["DSC_7980.jpg", "DJI_20250317090055_0868_D-4961.jpg"], location: "Sri Lanka hill country", category: "Aerial & Landscapes" },
  { slug: "on-the-rocks", folder: "On The Rocks", files: ["DJI_20250204162845_0534_D-4180.jpg", "SJP_1909-4174.jpg"], location: "Sri Lanka", category: "Aerial & Architecture" },
  { slug: "rock-villa", folder: "Rock Villa", files: ["DJI_20241001081458_0876_D.jpg", "SJP_8385-1918.jpg"], location: "Sri Lanka", category: "Aerial & Landscapes" },
  { slug: "solar-crab", folder: "Solar Crab", files: ["DSC_4598.jpg", "SJP_1447-4083.jpg"], location: "Sri Lanka", category: "Architecture & Interiors" },
  { slug: "sun-house", folder: "Sun House", files: ["DJI_20241106094954_0204_D-2666.jpg", "DSC_1217.jpg"], location: "Sri Lanka", category: "Aerial & Architecture" },
  { slug: "why-house", folder: "Why House", files: ["DJI_20250824083206_0196_D.jpg", "DSC_2592.jpg"], location: "Sri Lanka", category: "Aerial & Interiors" },
];

(async () => {
  const manifest = [];
  for (const p of PROPERTIES) {
    const outFiles = [];
    for (let i = 0; i < p.files.length; i++) {
      const src = path.join(ROOT, p.folder, p.files[i]);
      if (!fs.existsSync(src)) {
        console.warn("MISSING:", src);
        continue;
      }
      const outName = `${p.slug}-${i + 1}.jpg`;
      const info = await sharp(src)
        .rotate()
        .resize({ width: 1800, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toFile(path.join(OUT, outName));
      outFiles.push(outName);
      console.log(outName.padEnd(28), info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
    }
    manifest.push({ ...p, images: outFiles });
  }
  fs.writeFileSync(path.join(__dirname, "portfolio-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("\nWrote portfolio-manifest.json with", manifest.length, "properties");
})();
