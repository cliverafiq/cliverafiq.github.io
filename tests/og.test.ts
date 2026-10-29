import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { layers } from '../src/data/layers';
import { ogSvg, renderOg } from '../scripts/make-og.mjs';

test('renders a 1200 × 630 PNG', async () => {
  const out = join(tmpdir(), 'og-test.png');
  await renderOg(out);
  const png = readFileSync(out);
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
}, 20_000);

test('the preview shows the name, both headline lines, and all five layers', () => {
  const svg = ogSvg();
  for (const text of ['Clive Rafiq', 'I build production backend systems,', 'and I know what runs under them.']) expect(svg).toContain(text);
  for (const l of layers) expect(svg).toContain(`fill="${l.color}"`);
  expect(svg).not.toContain('Overpass');
});
test('the tab icon is a small stack in the Services, Data, and Product colors', () => {
  const icon = readFileSync('public/favicon.svg', 'utf8');
  for (const c of ['#2B59FF', '#FF7A1A', '#DFFF4F']) expect(icon).toContain(c);
});
