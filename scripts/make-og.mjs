// Renders the 1200 × 630 link-preview image to public/og.png.
// resvg-js 2.6.2 ignores `fontBuffers`, so the Fontsource WOFF2 files are
// decompressed to TTF on disk and passed as `fontFiles`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import wawoff2 from 'wawoff2';
import { profile } from '../src/data/profile.ts';
import { stops } from '../src/data/stops.ts';
import { tokens } from '../src/styles/tokens.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function fontFiles() {
  const dir = join(root, 'scripts/.fonts');
  mkdirSync(dir, { recursive: true });
  return Promise.all([400, 500].map(async weight => {
    const woff2 = readFileSync(join(root, `node_modules/@fontsource/overpass/files/overpass-latin-${weight}-normal.woff2`));
    const ttf = join(dir, `overpass-${weight}.ttf`);
    writeFileSync(ttf, Buffer.from(await wawoff2.decompress(woff2)));
    return ttf;
  }));
}

function svg() {
  const [first, ...rest] = profile.headline.split('. ');
  const lines = [`${first}.`, rest.join('. ')];
  const x0 = 140;
  const x1 = 1060;
  const y = 470;
  const step = (x1 - x0) / (stops.length - 1);
  const marks = stops.map((stop, i) => {
    const x = x0 + i * step;
    return `<circle cx="${x}" cy="${y}" r="12" fill="${tokens.page}" stroke="${tokens.route}" stroke-width="6"/>`
      + `<text x="${x}" y="${y + 58}" text-anchor="middle" font-size="26" fill="${tokens.muted}">${stop.city}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`
    + `<rect width="1200" height="630" fill="${tokens.page}"/>`
    + `<g font-family="Overpass">`
    + `<text x="80" y="150" font-size="56" font-weight="500" fill="${tokens.ink}">${profile.name}</text>`
    + lines.map((line, i) => `<text x="80" y="${250 + i * 56}" font-size="40" fill="${tokens.ink}">${line}</text>`).join('')
    + `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${tokens.route}" stroke-width="6"/>`
    + marks
    + `</g></svg>`;
}

export async function renderOg(outFile = join(root, 'public/og.png')) {
  const png = new Resvg(svg(), {
    font: { fontFiles: await fontFiles(), loadSystemFonts: false, defaultFontFamily: 'Overpass' },
  }).render().asPng();
  writeFileSync(outFile, png);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await renderOg();
}
