import { expect, test } from 'vitest';
import Hero from '../src/components/Hero.astro';
import TopBar from '../src/components/TopBar.astro';
import LayerBar from '../src/components/LayerBar.astro';
import { profile } from '../src/data/profile';
import { renderDoc } from './helpers/render';

test('the hero shows the name, headline, and line, with the resume filled', async () => {
  const doc = await renderDoc(Hero);
  const h1 = doc.querySelector('header#top[data-hero] h1')!;
  expect(h1.textContent?.trim()).toBe('Clive Rafiq');
  expect(h1.classList.contains('visually-hidden')).toBe(false);
  expect(doc.querySelector('.headline')?.textContent?.trim()).toBe(profile.headline);
  expect(doc.querySelector('.line')?.textContent?.trim()).toBe(profile.line);
  expect([...doc.querySelectorAll('.hero-links a')].map(a => [a.textContent?.trim(), a.getAttribute('href'), a.className])).toEqual([
    ['Resume', '/Rafiq_Clive_Resume.pdf', 'button primary'], ['GitHub', 'https://github.com/cliverafiq', 'button'],
  ]);
  expect(doc.querySelector('[hidden], [style*="opacity"]')).toBeNull();
});
test('the top bar links home, the resume, GitHub, and email', async () => {
  const doc = await renderDoc(TopBar);
  expect(doc.querySelector('nav.topbar[aria-label="Site"] a.home[href="#top"]')?.textContent?.trim()).toBe('Clive Rafiq');
  expect([...doc.querySelectorAll('nav.topbar a:not(.home)')].map(a => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
    ['Resume', '/Rafiq_Clive_Resume.pdf'], ['GitHub', 'https://github.com/cliverafiq'], ['Email', 'mailto:clive.rafiq@gmail.com'],
  ]);
});
test('the layer bar has a named segment per layer, chip to cloud', async () => {
  const doc = await renderDoc(LayerBar);
  const segs = [...doc.querySelectorAll('nav.layer-bar[data-layer-bar][aria-label="Layer shortcuts"] a[data-layer]')];
  expect(segs.map(a => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
    ['Hardware', '#entry-drift'], ['Firmware', '#entry-drift'], ['Services', '#entry-world-salon'],
    ['Data', '#entry-world-salon'], ['Product', '#entry-physioactive'],
  ]);
  expect(doc.querySelector('[data-layer-label]')?.textContent).toBe('All layers');
});
