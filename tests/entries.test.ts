import { expect, test } from 'vitest';
import WorkEntry from '../src/components/WorkEntry.astro';
import AlsoList from '../src/components/AlsoList.astro';
import Contact from '../src/components/Contact.astro';
import { work } from '../src/data/work';
import { renderDoc } from './helpers/render';

const shape = (el: Element) => [...el.children].map(c => c.tagName.toLowerCase() + (c.className ? `.${c.className}` : ''));
const entry = (slug: string) => work.find(w => w.slug === slug)!;

test('an internship shows its meta, text, highlight, and layer tags', async () => {
  const el = (await renderDoc(WorkEntry, { entry: entry('world-salon') })).querySelector('article#entry-world-salon[data-entry]')!;
  expect(el.getAttribute('data-layers')).toBe('services data');
  expect(shape(el)).toEqual(['h3', 'p.meta', 'p.text', 'p.highlight', 'ul.tags']);
  expect([el.querySelector('.meta .role')?.textContent, el.querySelector('.meta .dates')?.textContent]).toEqual(['Backend developer intern, New York', 'May – Aug 2026']);
  expect(el.querySelector('.highlight .value')?.textContent).toBe('2');
  expect([...el.querySelectorAll('.tags li')].map(li => [li.textContent, li.getAttribute('style')])).toEqual([
    ['Services', '--c:#2B59FF;--t:#F0F3FF'], ['Data', '--c:#FF7A1A;--t:#1E0D00'],
  ]);
});
test('SlackDB shows its award and links', async () => {
  const el = (await renderDoc(WorkEntry, { entry: entry('slackdb') })).querySelector('article')!;
  expect(shape(el)).toEqual(['h3', 'p.meta', 'p.text', 'p.award', 'ul.tags', 'p.links']);
  expect([...el.querySelectorAll('.links a')].map(a => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Code', 'https://github.com/AayushP123/slackdb'], ['Demo', 'https://slackdb.vercel.app/'],
  ]);
});
test('the wearable shows its photo, and SEDS shows its role alone', async () => {
  const wearable = (await renderDoc(WorkEntry, { entry: entry('assistive-wearable') })).querySelector('article')!;
  expect(shape(wearable)).toEqual(['h3', 'p.meta', 'p.text', 'figure.shot', 'ul.tags']);
  expect(wearable.querySelector('img')?.getAttribute('alt')).toMatch(/^The assistive wearable on a wrist/);
  const seds = (await renderDoc(WorkEntry, { entry: entry('seds-rocketry') })).querySelector('article')!;
  expect(shape(seds)).toEqual(['h3', 'p.meta', 'ul.tags']);
});
test('also lists three items, linking code where it exists', async () => {
  const doc = await renderDoc(AlsoList);
  expect(doc.querySelector('section#also[data-also] h2')?.textContent).toBe('Also');
  expect([...doc.querySelectorAll('ul.also li')].map(li => [li.querySelector('.name')?.textContent, li.querySelector('a')?.getAttribute('href') ?? null])).toEqual([
    ['MRI denoising research', 'https://github.com/cliverafiq/mri-tumor-segmentation'],
    ['k-Chinese Postman routing research', 'https://github.com/cliverafiq/postman'],
    ['TechTrek Indonesia', null],
  ]);
});
test('contact offers four ways to reach Clive', async () => {
  const contact = (await renderDoc(Contact)).querySelector('section#contact[data-contact]')!;
  expect(contact.querySelector('h2')?.textContent).toBe("Let's talk.");
  expect([...contact.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Email', 'mailto:clive.rafiq@gmail.com'], ['LinkedIn', 'https://www.linkedin.com/in/clive-rafiq'],
    ['GitHub', 'https://github.com/cliverafiq'], ['Resume', '/Rafiq_Clive_Resume.pdf'],
  ]);
});
