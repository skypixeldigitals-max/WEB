// Homepage curated-project covers, cropped to each card's aspect ratio (images/home/<slug>.webp + -800.webp).
// Usage: node scripts/home-covers.js <path-to-downloaded-Drive-folder>
const sharp = require('sharp'); const path = require('path'); const fs = require('fs');
const SRC = process.argv[2];
const COVERS = [
  ['armitage-hill-galle', 'Armitage Hill/SJP_3136-4264.jpg', 1600, 727],
  ['rock-villa', 'Rock Villa/SJP_9085-1853.jpg', 1000, 1000],
  ['fort-bazaar', 'Fort Bazaar/SJP_0095.jpg', 1920, 823],
  ['sun-house', 'Sun House/SJP_4417-HDR-2608.jpg', 1200, 900],
  ['peacock-hill-sigiriya', 'Peacock Hill Sigiriya/DSC_5621.jpg', 1200, 900],
  ['southbeach-weligama', 'Southbeach Weligama/DSC_2211-11588.jpg', 1920, 823],
];
(async () => {
  fs.mkdirSync('images/home', { recursive: true });
  for (const [slug, file, w, h] of COVERS) {
    const src = sharp(path.join(SRC, file)).rotate();
    await src.clone().resize(w, h, { fit: 'cover', position: 'centre' }).webp({ quality: 76 }).toFile(`images/home/${slug}.webp`);
    await src.clone().resize(800, Math.round(800 * h / w), { fit: 'cover', position: 'centre' }).webp({ quality: 72 }).toFile(`images/home/${slug}-800.webp`);
    console.log(slug);
  }
})();
