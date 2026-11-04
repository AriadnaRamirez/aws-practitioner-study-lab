// Regenerates the mascot logo mark + favicons from public/mascot/study.png.
// Usage (from frontend/): node scripts/generate-brand-icons.mjs
// `sharp` ships with Next.js (transitive dependency), no extra install needed.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "public/mascot/study.png");

// Head-only crop of the "study" pose: stops right above the book.
const HEAD = { left: 0, top: 0, width: 460, height: 258 };

const TILE_TOP = "#e27f4b";
const TILE_BOTTOM = "#c2552a";

function tileSvg(size, radius) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${TILE_TOP}"/>
      <stop offset="1" stop-color="${TILE_BOTTOM}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#g)"/>
</svg>`);
}

function maskSvg(size, radius) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
</svg>`);
}

/**
 * Orange squircle with the mascot head peeking from the bottom edge.
 * `zoom` = head width relative to the tile (>1 bleeds off the sides, used for
 * tiny favicons so the visor/eyes stay legible).
 */
async function renderMark(size, { zoom = 1.08, rounded = true } = {}) {
  const radius = rounded ? Math.round(size * 0.24) : 0;
  const headW = Math.round(size * zoom);
  const headH = Math.round((headW * HEAD.height) / HEAD.width);
  const head = await sharp(SOURCE)
    .extract(HEAD)
    .resize(headW, headH, { kernel: "lanczos3" })
    .toBuffer();

  const left = Math.round((size - headW) / 2);
  const top = size - headH + Math.round(size * 0.02);

  // Composite on an oversized canvas so negative offsets are allowed, then crop.
  const pad = headW;
  const base = await sharp({
    create: {
      width: size + pad * 2,
      height: size + pad * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: tileSvg(size, radius), left: pad, top: pad },
      { input: head, left: pad + left, top: pad + top },
    ])
    .png()
    .toBuffer();

  return sharp(base)
    .extract({ left: pad, top: pad, width: size, height: size })
    .composite([{ input: maskSvg(size, radius), blend: "dest-in" }])
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toBuffer();
}

/** Minimal ICO writer with embedded PNG entries (supported by all modern browsers). */
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const out = (p) => path.join(root, p);

await writeFile(out("public/brand/mascot-mark.png"), await renderMark(256, { zoom: 1.35 }));
await writeFile(out("src/app/icon.png"), await renderMark(192, { zoom: 1.45 }));
await writeFile(
  out("src/app/apple-icon.png"),
  await renderMark(180, { zoom: 1.35, rounded: false }),
);
const ico = [];
for (const size of [16, 32, 48]) {
  ico.push({ size, data: await renderMark(size, { zoom: 1.55 }) });
}
await writeFile(out("src/app/favicon.ico"), toIco(ico));

console.log("Brand icons generated.");
