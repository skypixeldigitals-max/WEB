// Imports the client's "Curated projects images" Drive folder (2026-11) into
// images/gallery/<slug>/NN.jpg (1600px, q76 — same settings as optimize-galleries.js),
// replacing each project's old gallery. Writes scripts/curated-2026-11.sql to sync the DB.
// Usage: node scripts/import-curated-2026-11.js <path-to-downloaded-folder>
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2];
const OUT_ROOT = path.join(__dirname, "..", "images", "gallery");

// Drive folder -> site project. Existing slugs are kept so old links keep working.
const PROJECTS = [
  { folder: "Armitage Hill", slug: "armitage-hill-galle", name: "Armitage Hill", location: "Galle, Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Rock Villa", slug: "rock-villa", name: "Rock Villa", location: "Bentota, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Fort Bazaar", slug: "fort-bazaar", name: "Fort Bazaar", location: "Galle Fort, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Sun House", slug: "sun-house", name: "Sun House", location: "Galle, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Peacock Hill Sigiriya", slug: "peacock-hill-sigiriya", name: "Peacock Hill", location: "Sigiriya, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Southbeach Weligama", slug: "southbeach-weligama", name: "Southbeach", location: "Weligama, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Aathma", slug: "aaathma", name: "Aathma", location: "Sri Jayawardenepura Kotte, Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Kalkudah Beach House", slug: "kalkudah-beach-house", name: "Kalkudah Beach House", location: "Kalkudah, Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Landesi", slug: "landesi-galle", name: "Landesi", location: "Galle, Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Le Grand", slug: "le-grand-galle", name: "Le Grand", location: "Galle, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Lunuganga", slug: "lunuganga", name: "Lunuganga", location: "Bentota, Sri Lanka", category: "Resorts & Hotels" },
  { folder: "Mimosa Hill", slug: "mimosa-hill", name: "Mimosa Hill", location: "Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Sihina Kosgoda", slug: "sihina-kosgoda", name: "Sihina", location: "Kosgoda, Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Suhasa", slug: "suhasa", name: "Suhasa", location: "Sri Lanka", category: "Villas & Private Homes" },
  { folder: "Summer Una", slug: "summer-una", name: "Summer Una", location: "Sri Lanka", category: "Villas & Private Homes" },
  { folder: "The Bunker House", slug: "the-bunker-house", name: "The Bunker House", location: "Sri Lanka", category: "Villas & Private Homes" },
];

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";

(async () => {
  const sql = ["begin;",
    // Anything not in the Drive set is hidden (draft), not deleted.
    `update properties set status='draft' where slug not in (${PROJECTS.map(p => q(p.slug)).join(",")});`];
  let total = 0, bytes = 0;
  for (const [order, p] of PROJECTS.entries()) {
    const srcDir = path.join(SRC, p.folder);
    const outDir = path.join(OUT_ROOT, p.slug);
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
    const urls = [];
    for (const [i, f] of files.entries()) {
      const name = String(i + 1).padStart(2, "0") + ".jpg";
      const src = sharp(path.join(srcDir, f)).rotate();
      const info = await src.clone()
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 76, progressive: true, mozjpeg: true })
        .toFile(path.join(outDir, name));
      // Small WebP for grids/thumbnails (pages derive it from the .jpg path: NN.jpg -> NN-sm.webp)
      const sm = await src.clone()
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(path.join(outDir, name.replace(".jpg", "-sm.webp")));
      bytes += info.size + sm.size;
      urls.push(`images/gallery/${p.slug}/${name}`);
    }
    total += urls.length;
    console.log(p.slug.padEnd(24), urls.length);
    sql.push(
      `insert into properties (slug,name,location,category,status,sort_order) values (${q(p.slug)},${q(p.name)},${q(p.location)},${q(p.category)},'published',${order + 1})
  on conflict (slug) do update set name=excluded.name, location=excluded.location, category=excluded.category, status='published', sort_order=excluded.sort_order;`,
      `delete from property_images where property_id=(select id from properties where slug=${q(p.slug)});`,
      `insert into property_images (property_id,url,sort_order) select id, v.url, v.ord from properties, (values ${urls.map((u, i) => `(${q(u)},${i + 1})`).join(",")}) as v(url,ord) where slug=${q(p.slug)};`
    );
  }
  sql.push("commit;");
  fs.writeFileSync(path.join(__dirname, "curated-2026-11.sql"), sql.join("\n") + "\n");
  console.log(`\n${total} photos, ${Math.round(bytes / 1048576)} MB; SQL -> scripts/curated-2026-11.sql`);
})();
