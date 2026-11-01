// Makes 1280w + 1920w copies of each hero-N.webp (originals are 3840w) for srcset.
const sharp = require('sharp'); const fs = require('fs');
(async () => {
  for (const f of fs.readdirSync('images').filter(f => /^hero-\d+\.webp$/.test(f))) {
    for (const w of [1280, 1920]) {
      const out = 'images/' + f.replace('.webp', `-${w}.webp`);
      const i = await sharp('images/' + f).resize({ width: w }).webp({ quality: 74 }).toFile(out);
      console.log(out, Math.round(i.size / 1024) + 'KB');
    }
  }
})();
