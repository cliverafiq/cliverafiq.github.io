import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { expect, test } from 'vitest';

const html = readFileSync('dist/index.html', 'utf8');
const css = [
  ...readdirSync('dist/_astro').filter(f => f.endsWith('.css')).map(f => readFileSync(`dist/_astro/${f}`, 'utf8')),
  ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]),
].join('\n');
const outsideKeyframes = css.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '');

test('page text has no middle dots or arrows', () => {
  expect(new JSDOM(html).window.document.body.textContent).not.toMatch(/·|→/);
});
test('nothing starts hidden outside the load animation', () => {
  expect(outsideKeyframes).not.toMatch(/opacity:\s*0(?![.\d])/);
});
test('reduced motion switches animation off', () => {
  expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
test('jumps to an entry clear the top bar, and the layer bar on phones', () => {
  expect(css).toMatch(/scroll-margin-top:\s*80px/);
  expect(css).toMatch(/scroll-margin-top:\s*128px/);
});
test('long names wrap, and the tilted stack cannot push the page sideways on phones', () => {
  expect(css).toMatch(/overflow-wrap:\s*anywhere/);
  expect(css).toMatch(/overflow:\s*clip/);
});
test('a focused plate shows at full strength even when dimmed', () => {
  expect(css).toMatch(/\.plate[^{]*:focus-visible[^{]*\{[^}]*opacity:\s*1/);
});
test('fonts are served from the site', () => {
  expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
  const files = readdirSync('dist/_astro').join(' ');
  for (const f of ['bricolage-grotesque-latin-800-normal', 'geist-latin-400-normal', 'geist-mono-latin-500-normal']) expect(files).toContain(f);
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
