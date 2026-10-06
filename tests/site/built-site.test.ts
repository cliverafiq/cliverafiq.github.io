import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { expect, test } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');
const css = [
  ...readdirSync('dist/_astro').filter(f => f.endsWith('.css')).map(f => readFileSync(`dist/_astro/${f}`, 'utf8')),
  ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]),
].join('\n');
const outsideKeyframes = css.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '');

test('no template patterns reach the page', () => {
  expect(new JSDOM(html).window.document.body.textContent).not.toMatch(/·|→/);
  expect(css).not.toMatch(/text-transform:\s*uppercase|monospace|box-shadow/);
});
test('nothing starts hidden outside the load animation', () => {
  expect(outsideKeyframes).not.toMatch(/opacity:\s*0(?![.\d])/);
  expect(outsideKeyframes).not.toMatch(/scaleX\(0\)/);
});
test('reduced motion switches animation off', () => {
  expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
test('linked stops clear the sticky top bar', () => {
  expect(css).toMatch(/scroll-margin-top:\s*88px/);
});
test('long names may wrap on narrow phones', () => {
  expect(css).toMatch(/overflow-wrap:\s*anywhere/);
});
test('assets ship with the site', () => {
  for (const f of ['favicon.svg', 'og.png', 'Rafiq_Clive_Resume.pdf', 'projects/assistive-wearable.jpg']) expect(existsSync(`dist/${f}`), f).toBe(true);
});
test('axe finds no violations it can check without a browser', async () => {
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  dom.window.eval(readFileSync('node_modules/axe-core/axe.min.js', 'utf8'));
  const axe = (dom.window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: { id: string }[] }> } }).axe;
  const result = await axe.run(dom.window.document as unknown as Document, { rules: { 'color-contrast': { enabled: false } } });
  expect(result.violations.map(v => v.id)).toEqual([]);
});
