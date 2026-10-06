import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { renderOg } from '../scripts/make-og.mjs';

test('renders a 1200 × 630 PNG', async () => {
  const out = join(tmpdir(), 'og-test.png');
  await renderOg(out);
  const png = readFileSync(out);
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
}, 20_000);
