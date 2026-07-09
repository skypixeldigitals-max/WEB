// Builds a labelled contact sheet so we can categorize the source photos at a glance.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = "C:/Users/admin/Downloads/CODE/shakir website images";
const OUT = path.join(__dirname, "..", "contact-sheet.jpg");

const files = fs.readdirSync(SRC).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();

const COLS = 5;
const CELL = 320;        // thumb width
const LABEL_H = 26;
const rows = Math.ceil(files.length / COLS);

(async () => {
  const composites = [];
  let i = 0;
  for (const f of files) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const thumb = await sharp(path.join(SRC, f))
      .resize(CELL, CELL, { fit: "cover" })
      .jpeg({ quality: 70 })
      .toBuffer();
    // label bar
    const idx = String(i + 1).padStart(2, "0");
    const svg = Buffer.from(
      `<svg width="${CELL}" height="${LABEL_H}"><rect width="100%" height="100%" fill="black"/>` +
      `<text x="6" y="18" fill="white" font-family="monospace" font-size="14">${idx}  ${f}</text></svg>`
    );
    const label = await sharp(svg).png().toBuffer();
    const cellImg = await sharp({
      create: { width: CELL, height: CELL + LABEL_H, channels: 3, background: "#111" },
    })
      .composite([{ input: thumb, top: 0, left: 0 }, { input: label, top: CELL, left: 0 }])
      .jpeg()
      .toBuffer();
    composites.push({ input: cellImg, top: row * (CELL + LABEL_H), left: col * CELL });
    i++;
  }
  await sharp({
    create: {
      width: COLS * CELL,
      height: rows * (CELL + LABEL_H),
      channels: 3,
      background: "#111",
    },
  })
    .composite(composites)
    .jpeg({ quality: 72 })
    .toFile(OUT);
  console.log("Wrote", OUT, "with", files.length, "images");
})();
