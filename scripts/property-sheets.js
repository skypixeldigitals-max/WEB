// Contact sheets grouped by property folder, a few folders per sheet, so we can
// pick 1-2 representative photos per property without guessing blind.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = "C:/Users/admin/Downloads/CODE/shakir website images";
const OUT_DIR = path.join(__dirname, "..", "_sheets");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const ALL_FOLDERS = fs.readdirSync(ROOT).filter(f =>
  fs.statSync(path.join(ROOT, f)).isDirectory() && f !== "Hero images"
);

const GROUP_SIZE = 4;
const groups = [];
for (let i = 0; i < ALL_FOLDERS.length; i += GROUP_SIZE) {
  groups.push(ALL_FOLDERS.slice(i, i + GROUP_SIZE));
}

const CELL = 220;
const LABEL_H = 20;
const COLS = 6;

async function buildSheet(folders, outPath) {
  const cells = []; // {folder, file}
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(ROOT, folder)).filter(f => /\.(jpe?g|png)$/i.test(f));
    for (const f of files) cells.push({ folder, file: f });
  }
  const rows = Math.ceil(cells.length / COLS);
  const composites = [];
  let i = 0;
  for (const c of cells) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const thumb = await sharp(path.join(ROOT, c.folder, c.file))
      .rotate()
      .resize(CELL, CELL, { fit: "cover" })
      .jpeg({ quality: 65 })
      .toBuffer();
    const label = `${c.folder} / ${c.file}`.slice(0, 34);
    const svg = Buffer.from(
      `<svg width="${CELL}" height="${LABEL_H}"><rect width="100%" height="100%" fill="black"/>` +
      `<text x="4" y="14" fill="white" font-family="monospace" font-size="9">${label}</text></svg>`
    );
    const labelImg = await sharp(svg).png().toBuffer();
    const cellImg = await sharp({ create: { width: CELL, height: CELL + LABEL_H, channels: 3, background: "#111" } })
      .composite([{ input: thumb, top: 0, left: 0 }, { input: labelImg, top: CELL, left: 0 }])
      .jpeg()
      .toBuffer();
    composites.push({ input: cellImg, top: row * (CELL + LABEL_H), left: col * CELL });
    i++;
  }
  await sharp({ create: { width: COLS * CELL, height: rows * (CELL + LABEL_H), channels: 3, background: "#111" } })
    .composite(composites)
    .jpeg({ quality: 70 })
    .toFile(outPath);
  console.log("wrote", outPath, "-", cells.length, "images from", folders.join(", "));
}

(async () => {
  for (let g = 0; g < groups.length; g++) {
    await buildSheet(groups[g], path.join(OUT_DIR, `sheet-${g + 1}.jpg`));
  }
})();
