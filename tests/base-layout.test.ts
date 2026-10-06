import { expect, test } from 'vitest';
import Base from '../src/layouts/Base.astro';
import { renderDoc } from './helpers/render';

const props = { title: 'Clive Rafiq', description: 'Backend engineer shipping production systems.' };

test('link previews use an absolute image URL', async () => {
  const doc = await renderDoc(Base, props, { default: '<main></main>' });
  expect(doc.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://cliverafiq.github.io/og.png');
  expect(doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image');
});
test('head sets viewport, icon, canonical URL, and description', async () => {
  const doc = await renderDoc(Base, props, { default: '' });
  expect(doc.querySelector('meta[name="viewport"]')?.getAttribute('content')).toBe('width=device-width, initial-scale=1, viewport-fit=cover');
  expect(doc.querySelector('link[rel="icon"]')?.getAttribute('href')).toBe('/favicon.svg');
  expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://cliverafiq.github.io/');
  expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(props.description);
});
test('tokens are set once on the root element', async () => {
  const doc = await renderDoc(Base, props, { default: '' });
  expect(doc.documentElement.getAttribute('style')).toBe('--page:#F6F7F9;--ink:#0F1B2A;--muted:#5B6B7E;--hairline:#DDE2E8;--track:#C9D1DB;--route:#1F4FD8');
});
