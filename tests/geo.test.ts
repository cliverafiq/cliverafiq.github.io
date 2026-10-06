import { expect, test } from 'vitest';
import { formatCoords, landDots, project, routePath } from '../src/lib/geo';
import { stops } from '../src/data/stops';

test('cities land where they belong on the Pacific-centred crop', () => {
  const jakarta = project(106.8, -6.2);
  const tempe = project(-111.9, 33.4);
  expect([jakarta.x, jakarta.y].map(n => +n.toFixed(4))).toEqual([0.1872, 0.8628]);
  expect([tempe.x, tempe.y].map(n => +n.toFixed(4))).toEqual([0.7524, 0.4023]);
});
test('the map has 1,191 land dots at 100 × 34', () => {
  expect(landDots()).toHaveLength(1191);
});
test('the route through the four stops starts at Jakarta and makes three hops', () => {
  const d = routePath(stops.map(s => project(s.lon, s.lat)));
  expect(d).toMatch(/^M187\.2 308 Q/);
  expect(d.match(/Q/g)).toHaveLength(3);
});
test('coordinates read like a station sign', () => {
  expect(formatCoords(-6.2, 106.8)).toBe('6.2° S, 106.8° E');
  expect(formatCoords(40.7, -74)).toBe('40.7° N, 74.0° W');
});
