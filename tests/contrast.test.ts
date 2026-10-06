import { expect, test } from 'vitest';
import { contrastRatio } from '../src/lib/contrast';
import { tokens } from '../src/styles/tokens';

test('matches WCAG reference values', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
});
test('text tokens meet WCAG AA on the page, and white meets it on the route', () => {
  for (const fg of [tokens.ink, tokens.muted, tokens.route]) expect(contrastRatio(fg, tokens.page)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio('#FFFFFF', tokens.route)).toBeGreaterThanOrEqual(4.5);
});
test('the filled route stands out from the track', () => {
  expect(contrastRatio(tokens.route, tokens.track)).toBeGreaterThanOrEqual(3);
});
test('the dark band keeps text readable on ink', () => {
  for (const fg of [tokens.page, tokens.routeOnDark, tokens.mutedOnDark]) expect(contrastRatio(fg, tokens.ink)).toBeGreaterThanOrEqual(4.5);
});
