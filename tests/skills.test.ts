import { expect, test } from 'vitest';
import SkillsFilter from '../src/components/SkillsFilter.astro';
import { renderDoc } from './helpers/render';

test('lists all 17 skills, each with a mini route in stop order', async () => {
  const doc = await renderDoc(SkillsFilter);
  const rows = [...doc.querySelectorAll('ul.skills > li')];
  expect(rows).toHaveLength(17);
  const python = rows.find(r => r.querySelector('.skill')?.textContent === 'Python')!;
  expect([...python.querySelectorAll('.mini-dot')].map(d => d.hasAttribute('data-used'))).toEqual([true, true, false, true]);
  expect(python.querySelector('.mini-route')?.getAttribute('aria-label')).toBe('Used in Jakarta, Tempe, New York');
});
test('the legend names the route in order', async () => {
  const doc = await renderDoc(SkillsFilter);
  expect(doc.querySelector('.legend')?.textContent).toBe('Dots follow the route: Jakarta, Tempe, West Lafayette, New York');
});
test('filters start hidden, so the page without JavaScript is a plain list', async () => {
  const doc = await renderDoc(SkillsFilter);
  const group = doc.querySelector('.filters')!;
  expect(group.hasAttribute('hidden')).toBe(true);
  expect([...group.querySelectorAll('button')].map(b => [b.textContent, b.getAttribute('aria-pressed')])).toEqual([
    ['All', 'true'], ['Languages', 'false'], ['Backend and infra', 'false'], ['Data and ML', 'false'], ['Hardware', 'false'],
  ]);
});
