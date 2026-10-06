import { expect, test } from 'vitest';
import { currentStopIndex, fillLength, visitedCount } from '../src/lib/route-math';

test('fill follows the probe and clamps to the spine', () => {
  expect(fillLength(500, 300, 1000)).toBe(200);
  expect(fillLength(100, 300, 1000)).toBe(0);
  expect(fillLength(2000, 300, 1000)).toBe(1000);
});
test('a stop counts as visited once the probe reaches its top', () => {
  expect(visitedCount([400, 800, 1200, 1600], 100)).toBe(0);
  expect(visitedCount([400, 800, 1200, 1600], 799)).toBe(1);
  expect(visitedCount([400, 800, 1200, 1600], 800)).toBe(2);
});
test('the current stop is the last visited one, or the first before any', () => {
  expect(currentStopIndex([400, 800, 1200, 1600], 1300)).toBe(2);
  expect(currentStopIndex([400, 800, 1200, 1600], 100)).toBe(0);
});
