import { expect, test } from 'vitest';
import ProjectRow from '../src/components/ProjectRow.astro';
import Projects from '../src/components/Projects.astro';
import { projects } from '../src/data/projects';
import { renderDoc } from './helpers/render';

test('three project rows in spec order, each tied to its stop', async () => {
  const doc = await renderDoc(Projects);
  expect([...doc.querySelectorAll('section#projects article.project')].map(a => [
    a.id, a.querySelector('h3')?.textContent, a.querySelector('.marker .city')?.textContent, a.querySelector('.marker .date')?.textContent,
  ])).toEqual([
    ['project-slackdb', 'SlackDB', 'Tempe', 'Apr 2026'],
    ['project-drift', 'Drift', 'West Lafayette', 'Apr 2026'],
    ['project-mri-denoising', 'MRI denoising', 'Tempe', 'Aug – Dec 2025'],
  ]);
});
test('a row carries what it is, my part, the stack, the result, and links', async () => {
  const doc = await renderDoc(ProjectRow, { project: projects[0] });
  expect(doc.querySelector('.summary')?.textContent).toBe('Text-to-SQL in Slack, with approvals before anything touches production');
  expect(doc.querySelector('.part')?.textContent).toBe('My part: SQL guardrails (risk-scored migrations, sandbox validation, approver enforcement) and the FastAPI backend');
  expect(doc.querySelector('.stack')?.textContent).toBe('FastAPI, Slack Bolt, PostgreSQL, Docker');
  expect(doc.querySelector('.result')?.textContent).toBe('AutoDB track winner at VillageHacks');
  expect([...doc.querySelectorAll('.links a')].map(a => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Code', 'https://github.com/cliverafiq/SlackDB'], ['Demo', 'https://slackdb.vercel.app/'],
  ]);
});
