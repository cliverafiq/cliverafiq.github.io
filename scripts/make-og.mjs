// Renders the 1200 × 630 link-preview image to public/og.png.
// resvg-js 2.6.2 ignores `fontBuffers`, so the Fontsource WOFF2 files are
// decompressed to TTF on disk and passed as `fontFiles`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import wawoff2 from 'wawoff2';
import { layers } from '../src/data/layers.ts';
import { profile } from '../src/data/profile.ts';
import { tokens } from '../src/styles/tokens.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function fontFiles() {
  const dir = join(root, 'scripts/.fonts');
  mkdirSync(dir, { recursive: true });
  return Promise.all([500, 800].map(async weight => {
    const woff2 = readFileSync(join(root, `node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-${weight}-normal.woff2`));
    const ttf = join(dir, `bricolage-grotesque-${weight}.ttf`);
    writeFileSync(ttf, Buffer.from(await wawoff2.decompress(woff2)));
    return ttf;
  }));
}

function headlineLines() {
  const i = profile.headline.indexOf(', ');
  return i < 0 ? [profile.headline] : [profile.headline.slice(0, i + 1), profile.headline.slice(i + 2)];
}

export function ogSvg() {
  const stack = layers.map((l, i) => {
    const cx = 900, y = 470 - i * 62;
    return `<polygon points="${cx},${y - 70} ${cx + 170},${y} ${cx},${y + 70} ${cx - 170},${y}" fill="${l.color}" stroke="rgb(0 0 0 / .35)" stroke-width="2"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`
    + `<rect width="1200" height="630" fill="${tokens.page}"/>`
    + `<g font-family="Bricolage Grotesque" fill="${tokens.ink}">`
    + `<text x="80" y="190" font-size="76" font-weight="800">${profile.name}</text>`
    + headlineLines().map((line, i) => `<text x="80" y="${270 + i * 48}" font-size="36" font-weight="500">${line}</text>`).join('')
    + `</g>${stack}</svg>`;
}

export async function renderOg(outFile = join(root, 'public/og.png')) {
  const png = new Resvg(ogSvg(), {
    font: { fontFiles: await fontFiles(), loadSystemFonts: false, defaultFontFamily: 'Bricolage Grotesque' },
  }).render().asPng();
  writeFileSync(outFile, png);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await renderOg();
}
