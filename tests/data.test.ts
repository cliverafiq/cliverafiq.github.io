import { expect, test } from 'vitest';
import { stops, stopById } from '../src/data/stops';
import { projects } from '../src/data/projects';
import { skills, categoryLabels } from '../src/data/skills';
import { profile } from '../src/data/profile';

test('stops run in journey order with the spec years and wins', () => {
  expect(stops.map(s => [s.id, s.city, s.years, s.win])).toEqual([
    ['jakarta', 'Jakarta', '2023–2026', 'Go services behind a 6,000-officer loan workflow'],
    ['tempe', 'Tempe', '2025–now', 'AutoDB track win at VillageHacks'],
    ['west-lafayette', 'West Lafayette', '2026', 'Drift, built in 48 hours'],
    ['new-york', 'New York', '2026', 'Real-time notifications on AWS'],
  ]);
});

test('entries follow the spec table order and carry role and line', () => {
  expect(stops.map(s => s.entries.map(e => e.org))).toEqual([
    ['BFI Finance', 'PhysioActive Indonesia', 'TechTrek Indonesia'],
    ['Arizona State University', 'SlackDB at VillageHacks', 'MRI denoising research'],
    ['Drift at StarkHacks, Purdue'],
    ['World Salon'],
  ]);
  expect(stops[0].entries[0].role).toBe('Backend intern, Dec 2025 – Jan 2026');
  for (const entry of stops.flatMap(s => s.entries)) expect(Boolean(entry.line) !== Boolean(entry.points), entry.org).toBe(true);
});

test('internships carry their resume bullets in order', () => {
  const work = stops.flatMap(s => s.entries).filter(e => e.points).map(e => [e.org, e.points!.length]);
  expect(work).toEqual([['BFI Finance', 3], ['PhysioActive Indonesia', 2], ['World Salon', 4]]);
  expect(stops[3].entries[0].points![0]).toBe('Owned per-recipient read/unread tracking end to end on a serverless notification service (FastAPI, AWS Lambda, DynamoDB)');
  expect(stops[0].entries[0].points![0]).toBe('Shipped Go microservices on Docker and Kubernetes into a production loan workflow used daily by 6,000 loan officers serving about 400K customers');
});

test('stopById finds stops and rejects unknown ids', () => {
  expect(stopById('tempe').city).toBe('Tempe');
  expect(() => stopById('mars' as never)).toThrow('Unknown stop: mars');
});

test('projects follow the spec order, point at stops, and link over https', () => {
  expect(projects.map(p => [p.slug, p.name, p.stop, p.date])).toEqual([
    ['slackdb', 'SlackDB', 'tempe', 'Apr 2026'],
    ['drift', 'Drift', 'west-lafayette', 'Apr 2026'],
    ['mri-denoising', 'MRI denoising', 'tempe', 'Aug – Dec 2025'],
  ]);
  expect(projects[0].links).toEqual([
    { label: 'Code', href: 'https://github.com/cliverafiq/SlackDB' },
    { label: 'Demo', href: 'https://slackdb.vercel.app/' },
  ]);
  for (const link of projects.flatMap(p => p.links)) expect(link.href).toMatch(/^https:\/\//);
});

test('every skill has a known category and lists real stops in route order', () => {
  expect(skills).toHaveLength(17);
  expect(categoryLabels).toEqual({ languages: 'Languages', 'backend-infra': 'Backend and infra', 'data-ml': 'Data and ML', hardware: 'Hardware' });
  const order = stops.map(s => s.id);
  for (const skill of skills) {
    expect(skill.usedAt.length).toBeGreaterThan(0);
    expect(skill.usedAt).toEqual([...skill.usedAt].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  }
  expect(skills.find(s => s.name === 'Python')?.usedAt).toEqual(['jakarta', 'tempe', 'new-york']);
});

test('profile copy matches the plan and no string uses a middle dot or arrow', () => {
  expect(profile.headline).toBe('Backend engineer. Shipping at every stop, from Jakarta to New York.');
  expect(JSON.stringify({ stops, projects, skills, profile })).not.toMatch(/·|→/);
});
