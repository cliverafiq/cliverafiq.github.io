import { JSDOM, type DOMWindow } from 'jsdom';
import { beforeEach, expect, test } from 'vitest';
import { initStack } from '../src/scripts/stack';

const sync = (update: () => void) => update();
const ids = ['hardware', 'firmware', 'services', 'data', 'product'];
let win: DOMWindow;
const $ = (s: string) => win.document.querySelector(s) as HTMLElement;
const $$ = (s: string) => [...win.document.querySelectorAll(s)] as HTMLElement[];
const start = () => initStack(win as unknown as Window, sync);
const on = (root: string) => $$(`${root} [data-layer][data-on]`).map(a => a.getAttribute('data-layer'));

function place(el: Element, top: number, height: number) {
  el.getBoundingClientRect = () => ({ top: top - win.scrollY, bottom: top + height - win.scrollY, height }) as DOMRect;
}
function scroll(y: number, dispatch = true) {
  Object.defineProperty(win, 'scrollY', { value: y, configurable: true });
  if (dispatch) win.dispatchEvent(new win.Event('scroll'));
}
function media(flags: Record<string, boolean>) {
  (win as any).matchMedia = (q: string) => ({ matches: Boolean(flags[q]) });
}
beforeEach(() => {
  const links = ids.map(id => `<a data-layer="${id}"></a>`).join('');
  win = new JSDOM(`<nav data-stack>${links}<i data-trace></i><i data-trace></i><i data-trace></i><i data-trace></i></nav>
    <nav data-layer-bar>${links}<span data-layer-label></span></nav>
    <header data-hero></header>
    <article data-entry data-layers="services data"></article>
    <article data-entry data-layers="services"></article>
    <article data-entry data-layers="firmware hardware"></article>
    <section data-also></section><section data-contact></section>`).window;
  Object.defineProperty(win, 'innerHeight', { value: 1000, configurable: true });
  Object.defineProperty(win, 'innerWidth', { value: 1000, configurable: true });
  scroll(0, false);
  place($('[data-hero]'), 0, 800);
  $$('[data-entry]').forEach((el, i) => place(el, 1000 + 600 * i, 600));
  place($('[data-also]'), 2800, 600);
  place($('[data-contact]'), 3400, 400);
});

test('starting mid-page lights the current entry at once', () => {
  scroll(1700, false); start();
  expect($('[data-stack]').hasAttribute('data-lit')).toBe(true);
  expect(new Set(on('[data-stack]'))).toEqual(new Set(['firmware', 'hardware']));
  expect(new Set(on('[data-layer-bar]'))).toEqual(new Set(['firmware', 'hardware']));
  expect($('[data-layer-label]').textContent).toBe('Hardware + Firmware');
});
test('the hero lights every layer and dims none', () => {
  start(); scroll(0);
  expect($('[data-stack]').hasAttribute('data-lit')).toBe(false);
  expect(on('[data-stack]')).toEqual([]);
  expect($('[data-layer-label]').textContent).toBe('All layers');
});
test('contact closes the stack', () => {
  start(); scroll(3000);
  expect($('[data-stack]').hasAttribute('data-closed')).toBe(true);
  expect($('[data-stack]').hasAttribute('data-lit')).toBe(false);
});
test('the pulse flips only when the lit layers change', () => {
  start();
  expect($('[data-stack]').getAttribute('data-pulse')).toBeNull();
  scroll(600); expect($('[data-stack]').getAttribute('data-pulse')).toBe('a');
  scroll(700); expect($('[data-stack]').getAttribute('data-pulse')).toBe('a');
  scroll(1200); expect($('[data-stack]').getAttribute('data-pulse')).toBe('b');
});
test('the layer bar shows once the hero leaves the screen', () => {
  start(); expect($('[data-layer-bar]').hasAttribute('data-show')).toBe(false);
  scroll(900); expect($('[data-layer-bar]').hasAttribute('data-show')).toBe(true);
});
test('the stack tilts toward a fine pointer', () => {
  media({ '(pointer: fine)': true }); start();
  win.dispatchEvent(new win.MouseEvent('pointermove', { clientX: 0, clientY: 0 }));
  expect($('[data-stack]').style.getPropertyValue('--rx')).toBe('4.00deg');
  expect($('[data-stack]').style.getPropertyValue('--rz')).toBe('-4.00deg');
});
test('reduced motion still lights layers but never pulses, tilts, or closes', () => {
  media({ '(pointer: fine)': true, '(prefers-reduced-motion: reduce)': true }); start();
  scroll(600); expect(new Set(on('[data-stack]'))).toEqual(new Set(['services', 'data']));
  expect($('[data-stack]').getAttribute('data-pulse')).toBeNull();
  win.dispatchEvent(new win.MouseEvent('pointermove', { clientX: 0, clientY: 0 }));
  expect($('[data-stack]').style.getPropertyValue('--rx')).toBe('');
  scroll(3000); expect($('[data-stack]').hasAttribute('data-closed')).toBe(false);
});
test('late layout is measured again on resize and load', () => {
  scroll(500, false); start();
  expect(new Set(on('[data-stack]'))).toEqual(new Set(['services', 'data']));
  $$('[data-entry]').forEach((el, i) => place(el, 1300 + 600 * i, 600));
  win.dispatchEvent(new win.Event('resize'));
  expect(on('[data-stack]')).toEqual([]);
  $$('[data-entry]').forEach((el, i) => place(el, 1000 + 600 * i, 600));
  win.dispatchEvent(new win.Event('load'));
  expect(new Set(on('[data-stack]'))).toEqual(new Set(['services', 'data']));
});
test('cleanup stops further updates', () => {
  const stop = start(); stop(); scroll(1700);
  expect($('[data-stack]').hasAttribute('data-lit')).toBe(false);
});
