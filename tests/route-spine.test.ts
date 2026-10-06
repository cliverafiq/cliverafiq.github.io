import { expect, test } from 'vitest';
import RouteSpine from '../src/components/RouteSpine.astro';
import { renderDoc } from './helpers/render';

test('experience is an ordered list of four stops with the ids the top route targets', async () => {
  const doc = await renderDoc(RouteSpine);
  expect([...doc.querySelectorAll('ol[data-spine] > li[data-stop]')].map(li => li.id)).toEqual(['stop-jakarta', 'stop-tempe', 'stop-west-lafayette', 'stop-new-york']);
});
test('each stop shows its city, years, and entries in spec order', async () => {
  const doc = await renderDoc(RouteSpine);
  const tempe = doc.getElementById('stop-tempe')!;
  expect(tempe.querySelector('h3 .city')?.textContent).toBe('Tempe');
  expect(tempe.querySelector('h3 .years')?.textContent).toBe('2025–now');
  expect([...tempe.querySelectorAll('.org')].map(p => p.textContent)).toEqual(['Arizona State University', 'SlackDB at VillageHacks', 'MRI denoising research']);
  const ny = doc.getElementById('stop-new-york')!;
  expect(ny.querySelector('.role')?.textContent).toBe('Backend developer intern, May – Aug 2026');
  expect(ny.querySelector('.line')?.textContent).toBe('Real-time notifications on API Gateway WebSockets; unblocked production twice');
});
test('the markup alone shows a complete route', async () => {
  const doc = await renderDoc(RouteSpine);
  expect(doc.querySelector('[data-spine]')?.hasAttribute('data-progress')).toBe(false);
  expect(doc.querySelectorAll('[data-stop-dot]')).toHaveLength(4);
  expect(doc.querySelector('[data-visited]')).toBeNull();
});
