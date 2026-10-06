import { expect, test } from 'vitest';
import Hero from '../src/components/Hero.astro';
import TopRoute from '../src/components/TopRoute.astro';
import { stops } from '../src/data/stops';
import { renderDoc } from './helpers/render';

test('top route lists the four stops in journey order, each linking to its section', async () => {
  const doc = await renderDoc(TopRoute, { stops });
  const items = [...doc.querySelectorAll('ol.top-route > li')];
  expect(items.map(li => li.querySelector('a')?.getAttribute('href'))).toEqual(['#stop-jakarta', '#stop-tempe', '#stop-west-lafayette', '#stop-new-york']);
  expect(items[2].querySelector('.city')?.textContent).toBe('West Lafayette');
  expect(items[0].querySelector('.years')?.textContent).toBe('2023–2026');
  expect(items[0].querySelector('.win')?.textContent).toBe('Go services behind a 6,000-officer loan workflow');
});
test('nothing in the top route waits for a script to appear', async () => {
  const doc = await renderDoc(TopRoute, { stops });
  expect(doc.querySelector('[hidden], [style*="opacity"], [style*="scale"]')).toBeNull();
});
test('hero names Clive, states the headline, and links the resume and GitHub', async () => {
  const doc = await renderDoc(Hero);
  expect(doc.querySelector('header#top[data-hero] h1')?.textContent?.trim()).toBe('Clive Rafiq');
  expect(doc.querySelector('.headline')?.textContent?.trim()).toBe('Backend engineer. Shipping at every stop, from Jakarta to New York.');
  const links = [...doc.querySelectorAll('header a')].map(a => [a.textContent?.trim(), a.getAttribute('href')]);
  expect(links).toContainEqual(['Resume', '/Rafiq_Clive_Resume.pdf']);
  expect(links).toContainEqual(['GitHub', 'https://github.com/cliverafiq']);
});
