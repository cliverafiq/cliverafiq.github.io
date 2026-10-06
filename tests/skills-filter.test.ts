import type { DOMWindow } from 'jsdom';
import { beforeEach, expect, test } from 'vitest';
import SkillsFilter from '../src/components/SkillsFilter.astro';
import { initSkillsFilter } from '../src/scripts/skills-filter';
import { renderWindow } from './helpers/render';

let win: DOMWindow;
const visible = () => [...win.document.querySelectorAll('ul.skills > li:not([hidden]) .skill')].map(s => s.textContent);
const press = (label: string) => ([...win.document.querySelectorAll('button')].find(b => b.textContent === label) as HTMLButtonElement).click();
beforeEach(async () => {
  win = await renderWindow(SkillsFilter);
  initSkillsFilter(win.document as unknown as Document);
});

test('the script reveals the filters', () => {
  expect(win.document.querySelector('.filters')!.hasAttribute('hidden')).toBe(false);
});
test('Hardware shows only ESP32 and WebSerial', () => {
  press('Hardware');
  expect(visible()).toEqual(['ESP32', 'WebSerial']);
});
test('All brings every skill back', () => {
  press('Languages');
  press('All');
  expect(visible()).toHaveLength(17);
});
test('exactly one filter is pressed after any sequence of clicks', () => {
  press('Languages'); press('Data and ML'); press('Languages');
  expect(win.document.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(1);
  expect(visible()).toEqual(['Python', 'Go', 'C++', 'SQL', 'Bash']);
});
