import { expect, test } from 'vitest';
import { contrastRatio } from '../src/lib/contrast';
import { tokens } from '../src/styles/tokens';
import { layers } from '../src/data/layers';

test('matches WCAG reference values', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
});
test('ink and muted meet AA on the page', () => {
  for (const fg of [tokens.ink, tokens.muted]) expect(contrastRatio(fg, tokens.page)).toBeGreaterThanOrEqual(4.5);
});
test('every layer text meets AA on its own color', () => {
  for (const l of layers) expect(contrastRatio(l.text, l.color), l.id).toBeGreaterThanOrEqual(4.5);
});
