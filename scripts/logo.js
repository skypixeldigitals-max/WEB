// Inspect + place the logo mark. Trim surrounding transparent/white space and
// output a clean PNG into images/logo.png.
const sharp = require("sharp");
const path = require("path");

const SRC = "C:/Users/admin/Downloads/CODE/shakir website images/logo mark cat.png";
const OUT = path.join(__dirname, "..", "images", "logo.png");

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log("source:", meta.width + "x" + meta.height, "channels:", meta.channels, "alpha:", meta.hasAlpha);
  const info = await sharp(SRC)
    .trim()                        // remove uniform border (whitespace)
    .resize({ height: 256, withoutEnlargement: true })
    .png()
    .toFile(OUT);
  console.log("wrote images/logo.png:", info.width + "x" + info.height, Math.round(info.size / 1024) + " KB");
})();
