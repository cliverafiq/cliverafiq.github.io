import { expect, test } from 'vitest';
import { layers, layerById } from '../src/data/layers';
import { work, also, firstEntryOn } from '../src/data/work';
import { profile } from '../src/data/profile';

test('layers run bottom to top with the spec colors and tech', () => {
  expect(layers.map(l => [l.id, l.name, l.color, l.text])).toEqual([
    ['hardware', 'Hardware', '#1E7A50', '#E9FFF3'], ['firmware', 'Firmware', '#2A2F3A', '#E7EAF0'],
    ['services', 'Services', '#2B59FF', '#F0F3FF'], ['data', 'Data', '#FF7A1A', '#1E0D00'],
    ['product', 'Product', '#DFFF4F', '#141600'],
  ]);
  expect(layerById('hardware').tech).toEqual(['ESP32', 'Raspberry Pi', 'sensors']);
  expect(layerById('services').tech).toEqual(['Go', 'NATS', 'FastAPI', 'Lambda']);
  expect(() => layerById('cloud' as never)).toThrow('Unknown layer: cloud');
});
test('work runs in the spec order on the spec layers', () => {
  expect(work.map(w => [w.slug, w.name, w.layers])).toEqual([
    ['world-salon', 'World Salon', ['services', 'data']],
    ['bfi-finance', 'BFI Finance', ['services']],
    ['physioactive', 'PhysioActive Indonesia', ['data', 'product']],
    ['slackdb', 'SlackDB', ['data', 'product']],
    ['drift', 'Drift', ['firmware', 'hardware']],
    ['assistive-wearable', 'Assistive wearable', ['hardware']],
    ['seds-rocketry', 'SEDS Rocketry Division at ASU', ['firmware']],
  ]);
});
test('every layer has an entry, and its link goes to the first one', () => {
  expect(layers.map(l => firstEntryOn(l.id).slug)).toEqual(['drift', 'drift', 'world-salon', 'world-salon', 'physioactive']);
});
test('each entry leads with at most one of a highlight, an award, or a photo', () => {
  for (const w of work) expect([w.highlight, w.award, w.image].filter(Boolean).length, w.slug).toBeLessThanOrEqual(1);
  expect(work.filter(w => w.highlight).map(w => w.highlight!.value)).toEqual(['2', '6,000', '−77%', '48 hours']);
  expect(work.find(w => w.slug === 'slackdb')?.award).toBe('AutoDB track winner');
  expect(work.find(w => w.slug === 'assistive-wearable')?.image?.src).toBe('/projects/assistive-wearable.jpg');
  const seds = work.find(w => w.slug === 'seds-rocketry')!;
  expect([seds.text, seds.highlight, seds.award, seds.image]).toEqual([undefined, undefined, undefined, undefined]);
});
test('links use https, and SlackDB keeps its code and demo', () => {
  for (const link of [...work.flatMap(w => w.links), ...also.flatMap(a => (a.link ? [a.link] : []))]) expect(link.href).toMatch(/^https:\/\//);
  expect(work.find(w => w.slug === 'slackdb')?.links).toEqual([
    { label: 'Code', href: 'https://github.com/cliverafiq/SlackDB' }, { label: 'Demo', href: 'https://slackdb.vercel.app/' },
  ]);
});
test('also lists the three smaller pieces in order', () => {
  expect(also.map(a => [a.name, a.link?.href])).toEqual([
    ['MRI denoising research', 'https://github.com/cliverafiq/mri-tumor-segmentation'],
    ['k-Chinese Postman routing research', 'https://github.com/cliverafiq/postman'],
    ['TechTrek Indonesia', undefined],
  ]);
});
test('profile carries the draft headline, and no string uses a middle dot or arrow', () => {
  expect(profile.headline).toBe('I build production backend systems, and I know what runs under them.');
  expect(JSON.stringify({ layers, work, also, profile })).not.toMatch(/·|→/);
});
