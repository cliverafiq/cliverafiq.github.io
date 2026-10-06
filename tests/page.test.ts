import { expect, test } from 'vitest';
import Index from '../src/pages/index.astro';
import { renderDoc } from './helpers/render';

test('sections run in the spec order', async () => {
  const doc = await renderDoc(Index);
  expect([...doc.querySelectorAll('main > header, main > section')].map(el => el.id)).toEqual(['top', 'about', 'experience', 'projects', 'skills', 'contact']);
});
test('about states the program and the early graduation', async () => {
  const doc = await renderDoc(Index);
  expect(doc.getElementById('about')?.textContent).toContain('I study Computer Systems Engineering at Arizona State University and graduate a year early, in May 2028.');
});
test('the contact stop is dashed and offers four ways to reach Clive', async () => {
  const contact = (await renderDoc(Index)).getElementById('contact')!;
  expect(contact.querySelector('h2')?.textContent).toBe('Next: 2027 internship');
  expect(contact.querySelector('.dot.dashed')).not.toBeNull();
  expect([...contact.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Email', 'mailto:clive.rafiq@gmail.com'], ['LinkedIn', 'https://www.linkedin.com/in/clive-rafiq'],
    ['GitHub', 'https://github.com/cliverafiq'], ['Resume', '/Rafiq_Clive_Resume.pdf'],
  ]);
});
test('every in-page link points at an element on the page', async () => {
  const doc = await renderDoc(Index);
  for (const a of doc.querySelectorAll('a[href^="#"]')) {
    expect(doc.getElementById(a.getAttribute('href')!.slice(1)), a.getAttribute('href')!).not.toBeNull();
  }
});
