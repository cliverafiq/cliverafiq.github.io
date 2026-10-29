import { expect, test } from 'vitest';
import Stack from '../src/components/Stack.astro';
import { renderDoc } from './helpers/render';

test('the stack lists the layers top to bottom, each linking to its first entry', async () => {
  const doc = await renderDoc(Stack);
  const plates = [...doc.querySelectorAll('nav.stack[data-stack][aria-label="Layers"] a.plate')];
  expect(plates.map(a => [a.getAttribute('data-layer'), a.querySelector('.name')?.textContent, a.getAttribute('href')])).toEqual([
    ['product', 'Product', '#entry-physioactive'], ['data', 'Data', '#entry-world-salon'],
    ['services', 'Services', '#entry-world-salon'], ['firmware', 'Firmware', '#entry-drift'], ['hardware', 'Hardware', '#entry-drift'],
  ]);
  expect(plates.map(a => a.getAttribute('style'))).toContain('--i:2;--c:#2B59FF;--t:#F0F3FF');
  expect([...plates[4].querySelectorAll('.tech[aria-hidden="true"] span')].map(s => s.textContent)).toEqual(['ESP32', 'Raspberry Pi', 'sensors']);
});
test('four decorative traces join the layers', async () => {
  const doc = await renderDoc(Stack);
  expect(doc.querySelectorAll('[data-trace][aria-hidden="true"]')).toHaveLength(4);
});
test('nothing in the stack waits for a script to appear', async () => {
  const doc = await renderDoc(Stack);
  expect(doc.querySelector('[hidden], [style*="opacity"], [data-lit], [data-closed]')).toBeNull();
});
