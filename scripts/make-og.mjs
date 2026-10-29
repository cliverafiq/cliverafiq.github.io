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

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Darkens a #RRGGBB color by factor f, for the plates' side edges. */
function shade(hex, f) {
  return '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0')).join('');
}

/** The site's stack, drawn flat: plates with thickness, soft shadows, corner traces, and names on the front edge. */
function stackSvg() {
  const cx = 920, w = 160, h = 64, t = 12, step = 58, base = 425;
  const ys = layers.map((_, i) => base - i * step);
  const top = (y, dy = 0) => `${cx},${y - h + dy} ${cx + w},${y + dy} ${cx},${y + h + dy} ${cx - w},${y + dy}`;
  // Text runs along the front-right edge and leans into the plate, so names sit on the plate's surface.
  const [ux, uy, vx, vy] = [w, -h, w, h].map(n => n / Math.hypot(w, h));
  const traces = [cx - w, cx + w].map(x => `<line x1="${x}" y1="${ys.at(-1)}" x2="${x}" y2="${ys[0] + t}" stroke="${tokens.ink}" stroke-opacity=".25" stroke-width="2"/>`).join('');
  const plates = layers.map((l, i) => {
    const y = ys[i];
    return `<polygon points="${top(y, t + 14)}" fill="#000" fill-opacity=".16" filter="url(#soft)"/>`
      + `<polygon points="${cx - w},${y} ${cx},${y + h} ${cx},${y + h + t} ${cx - w},${y + t}" fill="${shade(l.color, 0.72)}"/>`
      + `<polygon points="${cx},${y + h} ${cx + w},${y} ${cx + w},${y + t} ${cx},${y + h + t}" fill="${shade(l.color, 0.58)}"/>`
      + `<polygon points="${top(y)}" fill="${l.color}" stroke="rgb(0 0 0 / .3)" stroke-width="1.5"/>`
      + `<text transform="matrix(${ux} ${uy} ${vx} ${vy} ${cx - 0.02 * w} ${y + 0.74 * h})" font-size="22" font-weight="800" fill="${l.text}">${esc(l.name)}</text>`;
  }).join('');
  return `<defs><filter id="soft" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="10"/></filter></defs>`
    + `<g font-family="Bricolage Grotesque">${traces}${plates}</g>`;
}

export function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`
    + `<rect width="1200" height="630" fill="${tokens.page}"/>`
    + `<g font-family="Bricolage Grotesque" fill="${tokens.ink}">`
    + `<text x="80" y="255" font-size="76" font-weight="800">${esc(profile.name)}</text>`
    + headlineLines().map((line, i) => `<text x="80" y="${322 + i * 42}" font-size="32" font-weight="500">${esc(line)}</text>`).join('')
    + `</g>${stackSvg()}</svg>`;
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
