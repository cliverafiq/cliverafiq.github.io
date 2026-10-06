import { JSDOM, type DOMWindow } from 'jsdom';
import { beforeEach, expect, test } from 'vitest';
import { initRouteProgress } from '../src/scripts/route-progress';

// Layout for every test: hero 0–700, spine 1000–2600, dots at 1000/1400/1800/2200,
// viewport 1000 px tall, so the probe sits at scrollY + 550.
const sync = (update: () => void) => update();
const cities = ['Jakarta', 'Tempe', 'West Lafayette', 'New York'];
let win: DOMWindow;
const $ = (s: string) => win.document.querySelector(s) as HTMLElement;
const $$ = (s: string) => [...win.document.querySelectorAll(s)] as HTMLElement[];
const visited = () => $$('[data-stop-dot]').map(d => d.hasAttribute('data-visited'));
const start = () => initRouteProgress(win as unknown as Window, sync);

function place(el: Element, top: number, height: number) {
  el.getBoundingClientRect = () => ({ top: top - win.scrollY, bottom: top + height - win.scrollY, height }) as DOMRect;
}
function scroll(y: number, dispatch = true) {
  Object.defineProperty(win, 'scrollY', { value: y, configurable: true });
  if (dispatch) win.dispatchEvent(new win.Event('scroll'));
}
beforeEach(() => {
  win = new JSDOM(`<nav><ol data-topbar-route>${cities.map(c => `<li><a aria-label="${c}"></a></li>`).join('')}</ol><span data-current-city></span></nav>
    <header data-hero></header>
    <ol data-spine>${cities.map(() => '<li data-stop><span data-stop-dot></span></li>').join('')}</ol>`).window;
  Object.defineProperty(win, 'innerHeight', { value: 1000, configurable: true });
  scroll(0, false);
  place($('[data-hero]'), 0, 700);
  place($('[data-spine]'), 1000, 1600);
  $$('[data-stop-dot]').forEach((dot, i) => place(dot, 1000 + 400 * i, 16));
});

test('starting mid-page shows the right progress at once', () => {
  scroll(1200, false);
  start();
  expect($('[data-spine]').hasAttribute('data-progress')).toBe(true);
  expect($('[data-spine]').style.getPropertyValue('--fill')).toBe('750px');
  expect(visited()).toEqual([true, true, false, false]);
  expect($$('[data-topbar-route] a').map(a => a.getAttribute('aria-current'))).toEqual([null, 'location', null, null]);
  expect($('[data-current-city]').textContent).toBe('Tempe');
});
test('scrolling moves the fill, the visited stops, and the current city', () => {
  start();
  scroll(1600);
  expect($('[data-spine]').style.getPropertyValue('--fill')).toBe('1150px');
  expect(visited()).toEqual([true, true, true, false]);
  expect($('[data-current-city]').textContent).toBe('West Lafayette');
});
test('the top-bar route appears only after the hero leaves the screen', () => {
  start();
  expect($('[data-topbar-route]').hasAttribute('data-show')).toBe(false);
  scroll(800);
  expect($('[data-topbar-route]').hasAttribute('data-show')).toBe(true);
});
test('cleanup stops further updates', () => {
  const stop = start();
  stop();
  scroll(2500);
  expect($('[data-spine]').style.getPropertyValue('--fill')).toBe('0px');
});
