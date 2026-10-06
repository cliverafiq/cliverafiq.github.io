import { expect, test } from 'vitest';
import Hero from '../src/components/Hero.astro';
import WorldRoute from '../src/components/WorldRoute.astro';
import { renderDoc } from './helpers/render';

test('the route lists the four stops in journey order, each linking to its section', async () => {
  const doc = await renderDoc(WorldRoute);
  const items = [...doc.querySelectorAll('ol.top-route > li')];
  expect(items.map(li => li.querySelector('a')?.getAttribute('href'))).toEqual(['#stop-jakarta', '#stop-tempe', '#stop-west-lafayette', '#stop-new-york']);
  expect(items[2].querySelector('.city')?.textContent).toBe('West Lafayette');
  expect(items[0].querySelector('.years')?.textContent).toBe('2023–2026');
});
test('the wins strip lists the main win at each stop, in order', async () => {
  const doc = await renderDoc(WorldRoute);
  expect([...doc.querySelectorAll('ul.wins .win')].map(w => w.textContent)).toEqual([
    'Go services behind a 6,000-officer loan workflow', 'AutoDB track win at VillageHacks', 'Drift, built in 48 hours', 'Real-time notifications on AWS',
  ]);
});
test('the map draws land, one route, and a marker per stop', async () => {
  const doc = await renderDoc(WorldRoute);
  const svg = doc.querySelector('.world-route svg')!;
  expect(svg.getAttribute('viewBox')).toBe('0 0 1000 357');
  expect(svg.querySelector('path.land')?.getAttribute('d')?.match(/h0/g)).toHaveLength(1191);
  expect(svg.querySelectorAll('path.route')).toHaveLength(1);
  expect(svg.querySelectorAll('circle.marker')).toHaveLength(4);
});
test('nothing in the hero waits for a script to appear', async () => {
  const doc = await renderDoc(Hero);
  expect(doc.querySelector('[hidden], [style*="opacity"], [style*="scale"]')).toBeNull();
});
test('the hero keeps the name for screen readers and states the headline', async () => {
  const doc = await renderDoc(Hero);
  const h1 = doc.querySelector('header#top[data-hero] h1')!;
  expect(h1.textContent?.trim()).toBe('Clive Rafiq');
  expect(h1.classList.contains('visually-hidden')).toBe(true);
  expect(doc.querySelector('.headline')?.textContent?.trim()).toBe('Backend engineer. Shipping at every stop, from Jakarta to New York.');
  const links = [...doc.querySelectorAll('header a')].map(a => [a.textContent?.trim(), a.getAttribute('href')]);
  expect(links).toContainEqual(['Resume', '/Rafiq_Clive_Resume.pdf']);
  expect(links).toContainEqual(['GitHub', 'https://github.com/cliverafiq']);
});
