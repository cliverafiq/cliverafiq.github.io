import { expect, test } from 'vitest';
import TopBar from '../src/components/TopBar.astro';
import { renderDoc } from './helpers/render';

test('top bar links the name home and each stop by city', async () => {
  const doc = await renderDoc(TopBar);
  expect(doc.querySelector('nav.topbar a[href="#top"]')?.textContent?.trim()).toBe('Clive Rafiq');
  expect([...doc.querySelectorAll('[data-topbar-route] a')].map(a => [a.getAttribute('href'), a.getAttribute('aria-label')])).toEqual([
    ['#stop-jakarta', 'Jakarta'], ['#stop-tempe', 'Tempe'], ['#stop-west-lafayette', 'West Lafayette'], ['#stop-new-york', 'New York'],
  ]);
});
