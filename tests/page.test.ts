import { expect, test } from 'vitest';
import Index from '../src/pages/index.astro';
import { work } from '../src/data/work';
import { renderDoc } from './helpers/render';

test('the page runs hero, work, also, contact, with the stack pinned beside them', async () => {
  const doc = await renderDoc(Index);
  expect([...doc.querySelectorAll('main > header, main > section')].map(el => el.id)).toEqual(['top', 'work', 'also', 'contact']);
  expect(doc.querySelector('main > aside.pin .pin-inner nav[data-stack]')).not.toBeNull();
  expect(doc.querySelector('nav.topbar + nav[data-layer-bar] + main')).not.toBeNull();
});
test('entries appear in the work order', async () => {
  const doc = await renderDoc(Index);
  expect([...doc.querySelectorAll('#work article[data-entry]')].map(a => a.id)).toEqual(work.map(w => `entry-${w.slug}`));
});
test('every in-page link points at an element on the page', async () => {
  const doc = await renderDoc(Index);
  for (const a of doc.querySelectorAll('a[href^="#"]')) expect(doc.getElementById(a.getAttribute('href')!.slice(1)), a.getAttribute('href')!).not.toBeNull();
});
