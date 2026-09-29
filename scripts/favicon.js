// Builds images/favicon.png + apple-touch-icon.png from the thin-line logo:
// thickens the strokes and sets the cat on a white tile so it reads on dark tab bars.
const sharp = require('sharp');
(async () => {
  const W = 260; // work at 4x for a smooth thicken
  const alpha = await sharp('images/logo.png').ensureAlpha().resize({ width: W, kernel: 'lanczos3' })
    .extractChannel(3).blur(2.2).linear(4, 0).png().toBuffer();
  const meta = await sharp(alpha).metadata();
  const black = await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: '#111111' } })
    .joinChannel(alpha).png().toBuffer();
  for (const [out, size, pad] of [['images/favicon.png', 64, 0.08], ['images/apple-touch-icon.png', 180, 0.14]]) {
    const m = await sharp(black).resize({ height: Math.round(size * (1 - pad * 2)), fit: 'inside' }).toBuffer();
    const tile = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#ffffff"/></svg>`);
    await sharp(tile).composite([{ input: m, gravity: 'center' }]).png().toFile(out);
  }
  console.log('done');
})();
