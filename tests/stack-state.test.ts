import { expect, test } from 'vitest';
import { stackView, tiltFor } from '../src/lib/stack-state';

const marks = { entryTops: [1000, 1600, 2200], entriesEnd: 2800, contactTop: 3400 };
test('above the first entry, no entry is active and the stack is open', () => {
  expect(stackView(marks, 500)).toEqual({ active: -1, closed: false });
});
test('an entry is active from its top until the next one starts', () => {
  expect([1000, 1599, 1600, 2799].map(p => stackView(marks, p).active)).toEqual([0, 0, 1, 2]);
});
test('the Also list lights everything, and Contact closes the stack', () => {
  expect(stackView(marks, 2800)).toEqual({ active: -1, closed: false });
  expect(stackView(marks, 3400)).toEqual({ active: -1, closed: true });
});
test('a short entry still becomes active', () => {
  const short = { entryTops: [1000, 1040, 1600], entriesEnd: 2200, contactTop: 2800 };
  expect([1020, 1040].map(p => stackView(short, p).active)).toEqual([0, 1]);
});
test('tilt is zero at the center and reaches the limit at the corners', () => {
  expect(tiltFor(500, 500, 1000, 1000)).toEqual({ rx: 0, rz: 0 });
  expect(tiltFor(0, 0, 1000, 1000)).toEqual({ rx: 4, rz: -4 });
  expect(tiltFor(1000, 1000, 1000, 1000)).toEqual({ rx: -4, rz: 4 });
  expect(tiltFor(2000, -500, 1000, 1000)).toEqual({ rx: 4, rz: 4 });
  expect(tiltFor(0, 0, 1000, 1000, 2)).toEqual({ rx: 2, rz: -2 });
});
