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
  expect([...tempe.querySelectorAll('.org')].map(p => p.textContent)).toEqual(['Arizona State University', 'SEDS Rocketry Division at ASU', 'SlackDB at VillageHacks', 'Assistive wearable at the Fulton Schools', 'MRI denoising research']);
  const seds = [...tempe.querySelectorAll('.entries > li')][1];
  expect(seds.querySelector('.role')?.textContent).toBe('Firmware engineer, Aug 2026 – now');
  expect(seds.querySelector('.line')).toBeNull();
  const ny = doc.getElementById('stop-new-york')!;
  expect(ny.querySelector('.role')?.textContent).toBe('Backend developer intern, May – Aug 2026');
  expect(ny.querySelector('.entries > li.work .points li')?.textContent).toBe('Owned per-recipient read/unread tracking end to end on a serverless notification service (FastAPI, AWS Lambda, DynamoDB)');
});
test('the markup alone shows a complete route', async () => {
  const doc = await renderDoc(RouteSpine);
  expect(doc.querySelector('[data-spine]')?.hasAttribute('data-progress')).toBe(false);
  expect(doc.querySelectorAll('[data-stop-dot]')).toHaveLength(4);
  expect(doc.querySelector('[data-visited]')).toBeNull();
});
test('each stop shows its coordinates like a station sign', async () => {
  const doc = await renderDoc(RouteSpine);
  expect(doc.querySelector('#stop-jakarta .coords')?.textContent).toBe('6.2° S, 106.8° E');
  expect(doc.querySelector('#stop-new-york .coords')?.textContent).toBe('40.7° N, 74.0° W');
});
test('internships stand out with their bullets while other entries keep one line', async () => {
  const doc = await renderDoc(RouteSpine);
  expect([...doc.querySelectorAll('.entries > li.work .org')].map(o => o.textContent)).toEqual(['BFI Finance', 'PhysioActive Indonesia', 'World Salon']);
  expect(doc.querySelectorAll('#stop-new-york li.work .points li')).toHaveLength(4);
  const asu = [...doc.querySelectorAll('#stop-tempe .entries > li')][0];
  expect(asu.classList.contains('work')).toBe(false);
  expect(asu.querySelector('.line')?.textContent).toBe('Graduating a year early');
});
