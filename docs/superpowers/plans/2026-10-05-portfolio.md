# Clive Rafiq Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship Clive Rafiq's one-page portfolio at https://cliverafiq.github.io, organized around a route through the cities where his work happened.

**Architecture:** A static Astro site with one page assembled from small components. All content lives in data files under `src/data/`, and every view of the route (top route, route down the page, project rows, skill mini routes) reads from them. Two small client scripts add the scroll effects and the skills filter; the page is complete without them.

**Tech Stack:** Node 22.12+, Astro 7.3.5, TypeScript 6.0.3 with @astrojs/check 0.9.10, plain CSS, @fontsource/overpass 5.3.0, Vitest 5.0.3 with jsdom 30.1.2 (+ @types/jsdom 30.0.0) and axe-core 4.14.0, @resvg/resvg-js 2.6.2 and wawoff2 2.0.1 for the link-preview image, GitHub Actions to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-05-portfolio-design.md` (exported from the reviewed doc at https://claude.ai/code/artifact/d6f8df6c-ba4b-4d65-97b5-307c655367cc). Its tables are the source of every content string.

## Global Constraints

- Colors: exactly six tokens, defined once in `src/styles/tokens.ts`: page `#F6F7F9`, ink `#0F1B2A`, muted `#5B6B7E`, hairline `#DDE2E8`, track `#C9D1DB`, route `#1F4FD8`. Light only; no dark version.
- Type: Overpass only, via `@fontsource/overpass/latin-400.css` and `latin-500.css`; weights 400 and 500; `font-variant-numeric: tabular-nums` on dates and years. Sizes: 14 labels, 16 secondary text, 18 body, 24 stop and project names, 36 section headings, 48 headline (32 below 640 px).
- Layout: one left-aligned column, max width 1040 px, 24 px side padding, paragraphs capped at 70ch. The route runs along the left edge of the experience section.
- No template patterns: no monospace, no "A · B · C" strings, no "→" on links, no boxed card grids, no `box-shadow`, no `text-transform: uppercase`, no single accented word in a headline.
- Motion: one CSS-only load animation (top route draws left to right in about 1 s, stops appear in order); all other motion responds to scrolling and lives on the route. `prefers-reduced-motion: reduce` turns off every animation and transition.
- Without JavaScript: the route is fully drawn with solid dots, every skill is visible, every link works.
- Copy: strings come from the spec tables or `src/data/profile.ts` as given in Task 1, and stay draft until the copy pass in Task 10. No invented numbers.
- Accessibility: WCAG AA text contrast, everything keyboard-reachable, focus shows as a 2 px route-colored ring, both routes are ordered lists.
- `SITE_URL = 'https://cliverafiq.github.io'`, exported once from `src/data/site.ts`.
- Tests run in Vitest's default Node environment. Components cannot be rendered under `@vitest-environment jsdom` (Astro's container throws NoMatchingRenderer there), so script tests build an explicit `new JSDOM(...)` window and pass it in. Verified with Astro 7.3.5 and Vitest 5.0.3.

## Review Focus

1. Link previews: `og:image` must be the absolute `https://cliverafiq.github.io/og.png`; a relative path breaks LinkedIn and Slack cards. Pinned in Task 2.
2. JavaScript off or failing: the top route must still draw and the route down the page must show complete; nothing may start hidden waiting for a script. Pinned in Tasks 3, 4, and 9.
3. Reload or back-navigation mid-page: scroll effects must start from the current scroll position, not from the top. Pinned in Task 5.
4. Hash links such as `#stop-new-york` must land below the sticky top bar, not under it. Pinned in Tasks 4 and 9, checked by eye in Task 10.
5. Narrow phones (320 px): "West Lafayette" and long skill names must wrap, and the page must never scroll sideways. Pinned in Task 9, checked by eye in Task 10.

---

### Task 1: Project scaffold and content model

**Files:**
- Create: `package.json`, `astro.config.ts`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
- Create: `src/data/site.ts`, `src/data/types.ts`, `src/data/stops.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/profile.ts`
- Create: `src/pages/index.astro` (placeholder until Task 8)
- Test: `tests/data.test.ts`

**Interfaces:**
- Produces:
```ts
// src/data/site.ts
export const SITE_URL = 'https://cliverafiq.github.io';
// src/data/types.ts
export type StopId = 'jakarta' | 'tempe' | 'west-lafayette' | 'new-york';
export interface Entry { org: string; role: string; line: string } // role = the spec's "Role and dates" cell
export interface Stop { id: StopId; city: string; years: string; win: string; entries: Entry[] }
export interface ProjectLink { label: 'Code' | 'Demo'; href: string }
export interface Project { slug: string; name: string; stop: StopId; date: string; summary: string; part: string; stack: string[]; result: string; links: ProjectLink[] }
export type SkillCategory = 'languages' | 'backend-infra' | 'data-ml' | 'hardware';
export interface Skill { name: string; category: SkillCategory; usedAt: StopId[] }
export interface Profile { name: string; headline: string; about: string[]; email: string; linkedin: string; github: string; resumePath: string }
// src/data/stops.ts
export const stops: Stop[];                 // journey order
export function stopById(id: StopId): Stop; // throws Error(`Unknown stop: ${id}`)
// src/data/projects.ts
export const projects: Project[];
// src/data/skills.ts
export const skills: Skill[];
export const categoryLabels: Record<SkillCategory, string>;
// src/data/profile.ts
export const profile: Profile;
```

- [ ] **Step 1: Scaffold the project**

`package.json`: private, `"type": "module"`, scripts:
```json
{ "dev": "astro dev", "build": "astro check && astro build", "test": "vitest run",
  "test:site": "astro build && SITE_TESTS=1 vitest run", "og": "node scripts/make-og.mjs",
  "preview:file": "node scripts/build-preview.mjs" }
```
Dependencies: `astro@7.3.5`, `@fontsource/overpass@5.3.0`. Dev dependencies: `@astrojs/check@0.9.10`, `typescript@6.0.3`, `vitest@5.0.3`, `jsdom@30.1.2`, `@types/jsdom@30.0.0`, `axe-core@4.14.0`, `@resvg/resvg-js@2.6.2`, `wawoff2@2.0.1`. (TypeScript 7 is out but @astrojs/check accepts only ^5 or ^6.)

`astro.config.ts`: `defineConfig({ site: SITE_URL })`, importing `SITE_URL` from `./src/data/site`. `tsconfig.json` extends `astro/tsconfigs/strict`. `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `preview/`, `scripts/.fonts/`.

`vitest.config.ts`:
```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';
const site = Boolean(process.env.SITE_TESTS);
export default getViteConfig({ test: {
  include: site ? ['tests/site/**/*.test.ts'] : ['tests/**/*.test.ts'],
  exclude: site ? ['node_modules/**'] : ['node_modules/**', 'tests/site/**'],
} });
```
Run: `npm install`. Expected: no peer-dependency errors.

- [ ] **Step 2: Write the failing tests**

```ts
// tests/data.test.ts
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
  expect(stops[0].entries[0]).toEqual({ org: 'BFI Finance', role: 'Backend intern, Dec 2025 – Jan 2026',
    line: 'Go microservices in a production loan workflow used daily by 6,000 loan officers serving about 400K customers' });
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
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run tests/data.test.ts`
Expected: FAIL, cannot resolve `../src/data/stops`.

- [ ] **Step 4: Write the data files**

Copy every row of the spec's route table, "Experience entries", "Projects", and "Skills and where they were used" tables into `stops.ts`, `projects.ts`, and `skills.ts` verbatim. For projects: `summary` = "What it is", `part` = "Clive's part", `stack` = the Stack cell split on `", "`, `date` = the date half of "Stop and date". `profile.ts` holds exactly:
```ts
export const profile: Profile = {
  name: 'Clive Rafiq',
  headline: 'Backend engineer. Shipping at every stop, from Jakarta to New York.',
  about: [
    'I study Computer Systems Engineering at Arizona State University and graduate a year early, in May 2028.',
    'I build backend systems that run in production, and I care most about the layer where software meets hardware.',
  ],
  email: 'clive.rafiq@gmail.com',
  linkedin: 'https://www.linkedin.com/in/clive-rafiq',
  github: 'https://github.com/cliverafiq',
  resumePath: '/Rafiq_Clive_Resume.pdf',
};
```
`src/pages/index.astro` renders `<h1>{profile.name}</h1>` until Task 8.

- [ ] **Step 5: Run the tests and the build**

Run: `npx vitest run tests/data.test.ts && npm run build`
Expected: 6 tests pass; `astro check` reports 0 errors; `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold Astro site and content model"
```

### Task 2: Tokens, fonts, and base layout

**Files:**
- Create: `src/styles/tokens.ts`, `src/styles/global.css`, `src/lib/contrast.ts`, `src/layouts/Base.astro`, `tests/helpers/render.ts`
- Test: `tests/contrast.test.ts`, `tests/base-layout.test.ts`

**Interfaces:**
- Consumes: `SITE_URL` (Task 1).
- Produces:
```ts
// src/styles/tokens.ts
export const tokens = { page: '#F6F7F9', ink: '#0F1B2A', muted: '#5B6B7E', hairline: '#DDE2E8', track: '#C9D1DB', route: '#1F4FD8' } as const;
export const tokenStyle: string; // '--page:#F6F7F9;--ink:#0F1B2A;…' in key order, no trailing semicolon
// src/lib/contrast.ts
export function contrastRatio(foreground: string, background: string): number; // WCAG 2.x, #RRGGBB
// tests/helpers/render.ts (experimental_AstroContainer + jsdom)
export function renderHtml(component: AstroComponentFactory, props?: Record<string, unknown>, slots?: Record<string, string>): Promise<string>;
export function renderDoc(component: AstroComponentFactory, props?: Record<string, unknown>, slots?: Record<string, string>): Promise<Document>;
export function renderWindow(component: AstroComponentFactory, props?: Record<string, unknown>, slots?: Record<string, string>): Promise<DOMWindow>;
```
- `Base.astro`: props `{ title: string; description: string }`; renders the whole document with `<html lang="en" style={tokenStyle}>` and the default slot in `<body>`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/contrast.test.ts
import { expect, test } from 'vitest';
import { contrastRatio } from '../src/lib/contrast';
import { tokens } from '../src/styles/tokens';

test('matches WCAG reference values', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
});
test('text tokens meet WCAG AA on the page, and white meets it on the route', () => {
  for (const fg of [tokens.ink, tokens.muted, tokens.route]) expect(contrastRatio(fg, tokens.page)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio('#FFFFFF', tokens.route)).toBeGreaterThanOrEqual(4.5);
});
test('the filled route stands out from the track', () => {
  expect(contrastRatio(tokens.route, tokens.track)).toBeGreaterThanOrEqual(3);
});
```
```ts
// tests/base-layout.test.ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/contrast.test.ts tests/base-layout.test.ts`
Expected: FAIL, cannot resolve `../src/lib/contrast` and `../src/layouts/Base.astro`.

- [ ] **Step 3: Implement**

`contrastRatio`: sRGB channel linearization with the 0.04045 threshold, relative luminance `0.2126 R + 0.7152 G + 0.0722 B`, ratio `(lighter + 0.05) / (darker + 0.05)`. `render.ts`: `experimental_AstroContainer.create()` then `renderToString(component, { props, slots })`; `renderDoc` and `renderWindow` parse that string with `new JSDOM(html)`. `Base.astro`: imports the two Fontsource CSS files and `../styles/global.css`; head has charset, viewport, title, description, `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`, canonical `new URL('/', SITE_URL).href`, `og:title`, `og:description`, `og:type` `website`, `og:url`, `og:image` `new URL('/og.png', SITE_URL).href`, `twitter:card` `summary_large_image`. `global.css` sets the Global Constraints values (font stack `'Overpass', system-ui, sans-serif`; body 18 px/1.55 on `var(--page)` in `var(--ink)`; links in `var(--route)` with 1 px underline offset 3 px; `:focus-visible { outline: 2px solid var(--route); outline-offset: 3px }`; a `.wrap` container; a `.visually-hidden` utility; and `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important } }`).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/contrast.test.ts tests/base-layout.test.ts`
Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add design tokens, fonts, and base layout"
```

### Task 3: Top section with the route

**Files:**
- Create: `src/components/TopRoute.astro`, `src/components/Hero.astro`
- Test: `tests/hero.test.ts`

**Interfaces:**
- Consumes: `stops`, `profile` (Task 1); `renderDoc` (Task 2).
- Produces: `TopRoute` props `{ stops: Stop[] }` → `<ol class="top-route">` with one `<li style="--i:{index}">` per stop, each holding `<a href="#stop-{id}">` with `<span class="dot" aria-hidden="true">`, `<span class="city">`, `<span class="years">`, `<span class="win">`. `Hero` (no props) → `<header id="top" data-hero>` with `<h1>` name, `<p class="headline">`, the top route, and links labeled "Resume" and "GitHub". Task 5 relies on `data-hero`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/hero.test.ts
import { expect, test } from 'vitest';
import Hero from '../src/components/Hero.astro';
import TopRoute from '../src/components/TopRoute.astro';
import { stops } from '../src/data/stops';
import { renderDoc } from './helpers/render';

test('top route lists the four stops in journey order, each linking to its section', async () => {
  const doc = await renderDoc(TopRoute, { stops });
  const items = [...doc.querySelectorAll('ol.top-route > li')];
  expect(items.map(li => li.querySelector('a')?.getAttribute('href'))).toEqual(['#stop-jakarta', '#stop-tempe', '#stop-west-lafayette', '#stop-new-york']);
  expect(items[2].querySelector('.city')?.textContent).toBe('West Lafayette');
  expect(items[0].querySelector('.years')?.textContent).toBe('2023–2026');
  expect(items[0].querySelector('.win')?.textContent).toBe('Go services behind a 6,000-officer loan workflow');
});
test('nothing in the top route waits for a script to appear', async () => {
  const doc = await renderDoc(TopRoute, { stops });
  expect(doc.querySelector('[hidden], [style*="opacity"], [style*="scale"]')).toBeNull();
});
test('hero names Clive, states the headline, and links the resume and GitHub', async () => {
  const doc = await renderDoc(Hero);
  expect(doc.querySelector('header#top[data-hero] h1')?.textContent?.trim()).toBe('Clive Rafiq');
  expect(doc.querySelector('.headline')?.textContent?.trim()).toBe('Backend engineer. Shipping at every stop, from Jakarta to New York.');
  const links = [...doc.querySelectorAll('header a')].map(a => [a.textContent?.trim(), a.getAttribute('href')]);
  expect(links).toContainEqual(['Resume', '/Rafiq_Clive_Resume.pdf']);
  expect(links).toContainEqual(['GitHub', 'https://github.com/cliverafiq']);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/hero.test.ts`
Expected: FAIL, cannot resolve `../src/components/Hero.astro`.

- [ ] **Step 3: Implement the components**

Layout: name at 18 px/500, headline at 48 px (32 px below 640 px) in ink, then the route. The route is a `repeat(4, minmax(0, 1fr))` grid with a 3 px route-colored line (`::before`) from the first dot's center to the last's. Load animation, CSS only, defined with `from` keyframes so the final state is the default: the line uses `@keyframes route-draw { from { transform: scaleX(0) } }`, 1 s ease-out, `transform-origin: left`; each `li` uses `@keyframes stop-in { from { opacity: 0 } }` with `animation-delay: calc(150ms + var(--i) * 200ms)` and `animation-fill-mode: both`. Below 640 px, `.years` and `.win` are hidden and `.city` gets `overflow-wrap: anywhere`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/hero.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add the hero and the top route"
```

### Task 4: Experience as the route down the page

**Files:**
- Create: `src/components/RouteSpine.astro`
- Test: `tests/route-spine.test.ts`

**Interfaces:**
- Consumes: `stops` (Task 1); `renderDoc` (Task 2).
- Produces (the contract Task 5's script uses): `<section id="experience" aria-labelledby="experience-title">` → `<h2 id="experience-title">Experience</h2>` → `<ol class="spine" data-spine>` of `<li class="stop" id="stop-{id}" data-stop>`, each with `<span class="dot" data-stop-dot aria-hidden="true">`, `<h3><span class="city">{city}</span> <span class="years">{years}</span></h3>`, and `<ul class="entries">` of `<li>` holding `<p class="org">`, `<p class="role">`, `<p class="line">`. The track and fill are `::before` and `::after` on the `<ol>` (no extra elements inside a list).
- CSS contract: without `data-progress` on the `<ol>`, the fill is full height and dots are solid. With `data-progress`, the fill height is `var(--fill, 0px)` and dots are hollow unless they carry `data-visited`. Every `.stop` has `scroll-margin-top: 88px` (64 px top bar + 24 px).

- [ ] **Step 1: Write the failing tests**

```ts
// tests/route-spine.test.ts
import { expect, test } from 'vitest';
import RouteSpine from '../src/components/RouteSpine.astro';
import { renderDoc } from './helpers/render';

test('experience is an ordered list of four stops with the ids the top route targets', async () => {
  const doc = await renderDoc(RouteSpine);
  expect([...doc.querySelectorAll('ol[data-spine] > li[data-stop]')].map(li => li.id)).toEqual(['stop-jakarta', 'stop-tempe', 'stop-west-lafayette', 'stop-new-york']);
});
test('each stop shows its city, years, and entries in spec order', async () => {
  const doc = await renderDoc(RouteSpine);
  const tempe = doc.getElementById('stop-tempe')!;
  expect(tempe.querySelector('h3 .city')?.textContent).toBe('Tempe');
  expect(tempe.querySelector('h3 .years')?.textContent).toBe('2025–now');
  expect([...tempe.querySelectorAll('.org')].map(p => p.textContent)).toEqual(['Arizona State University', 'SlackDB at VillageHacks', 'MRI denoising research']);
  const ny = doc.getElementById('stop-new-york')!;
  expect(ny.querySelector('.role')?.textContent).toBe('Backend developer intern, May – Aug 2026');
  expect(ny.querySelector('.line')?.textContent).toBe('Real-time notifications on API Gateway WebSockets; unblocked production twice');
});
test('the markup alone shows a complete route', async () => {
  const doc = await renderDoc(RouteSpine);
  expect(doc.querySelector('[data-spine]')?.hasAttribute('data-progress')).toBe(false);
  expect(doc.querySelectorAll('[data-stop-dot]')).toHaveLength(4);
  expect(doc.querySelector('[data-visited]')).toBeNull();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/route-spine.test.ts`
Expected: FAIL, cannot resolve `../src/components/RouteSpine.astro`.

- [ ] **Step 3: Implement `RouteSpine.astro`**

Track in `var(--track)`, fill in `var(--route)`, both 3 px wide on the left edge; dots 11 px with a 3 px route-colored border; city at 24 px/500, years at 14 px muted with tabular numerals; org at 18 px/500, role at 14 px muted, line at 16 px muted; entries separated by a 1 px hairline.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/route-spine.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add the route down the page"
```

### Task 5: Scroll effects and the top bar

**Files:**
- Create: `src/lib/route-math.ts`, `src/scripts/route-progress.ts`, `src/components/TopBar.astro`
- Modify: `src/components/RouteSpine.astro` (the `data-progress` and `data-visited` styles from Task 4's contract)
- Test: `tests/route-math.test.ts`, `tests/route-progress.test.ts`, `tests/top-bar.test.ts`

**Interfaces:**
- Consumes: the `data-hero`, `data-spine`, `data-stop-dot` contract (Tasks 3–4); `stops` (Task 1); `renderDoc` (Task 2).
- Produces:
```ts
// src/lib/route-math.ts
export const PROBE_RATIO = 0.55;
export function fillLength(probeY: number, spineTop: number, spineHeight: number): number; // clamp(probeY - spineTop, 0, spineHeight)
export function visitedCount(stopTops: readonly number[], probeY: number): number;       // number of tops <= probeY
export function currentStopIndex(stopTops: readonly number[], probeY: number): number;   // max(visitedCount - 1, 0)
// src/scripts/route-progress.ts
export function initRouteProgress(win?: Window, schedule?: (update: () => void) => void): () => void;
```
`initRouteProgress` touches the DOM only through `win.document`. It sets `data-progress` on `[data-spine]`, then on init and on every `scroll` or `resize` (through `schedule`, default `win.requestAnimationFrame`): probe = `win.scrollY + win.innerHeight * PROBE_RATIO`; page positions = `getBoundingClientRect().top + win.scrollY` of the spine and of each `[data-stop-dot]`; sets `--fill` on the spine to `${px}px`; sets `data-visited` on the first `visitedCount` dots and removes it from the rest; sets `aria-current="location"` on the matching `[data-topbar-route] a` (removing it from the others) and copies that link's `aria-label` into `[data-current-city]`; sets `data-show` on `[data-topbar-route]` while the hero's `getBoundingClientRect().bottom < 0`. It returns a function that removes both listeners.
- `TopBar.astro` (no props) → `<nav class="topbar" aria-label="Route">` holding `<a href="#top">Clive Rafiq</a>`, `<ol data-topbar-route>` of four `<li><a href="#stop-{id}" aria-label="{city}"><span class="dot" aria-hidden="true"></span></a></li>`, and `<span data-current-city></span>`; plus `<script>` that imports and calls `initRouteProgress()`. The bar is sticky at the top, 64 px tall plus `env(safe-area-inset-top)`, page-colored with a hairline bottom border; the mini route is `visibility: hidden` until `[data-show]`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/route-math.test.ts
import { expect, test } from 'vitest';
import { currentStopIndex, fillLength, visitedCount } from '../src/lib/route-math';

test('fill follows the probe and clamps to the spine', () => {
  expect(fillLength(500, 300, 1000)).toBe(200);
  expect(fillLength(100, 300, 1000)).toBe(0);
  expect(fillLength(2000, 300, 1000)).toBe(1000);
});
test('a stop counts as visited once the probe reaches its top', () => {
  expect(visitedCount([400, 800, 1200, 1600], 100)).toBe(0);
  expect(visitedCount([400, 800, 1200, 1600], 799)).toBe(1);
  expect(visitedCount([400, 800, 1200, 1600], 800)).toBe(2);
});
test('the current stop is the last visited one, or the first before any', () => {
  expect(currentStopIndex([400, 800, 1200, 1600], 1300)).toBe(2);
  expect(currentStopIndex([400, 800, 1200, 1600], 100)).toBe(0);
});
```
```ts
// tests/route-progress.test.ts
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
```
```ts
// tests/top-bar.test.ts
import { expect, test } from 'vitest';
import TopBar from '../src/components/TopBar.astro';
import { renderDoc } from './helpers/render';

test('top bar links the name home and each stop by city', async () => {
  const doc = await renderDoc(TopBar);
  expect(doc.querySelector('nav.topbar a[href="#top"]')?.textContent?.trim()).toBe('Clive Rafiq');
  expect([...doc.querySelectorAll('[data-topbar-route] a')].map(a => [a.getAttribute('href'), a.getAttribute('aria-label')])).toEqual([
    ['#stop-jakarta', 'Jakarta'], ['#stop-tempe', 'Tempe'], ['#stop-west-lafayette', 'West Lafayette'], ['#stop-new-york', 'New York'],
  ]);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/route-math.test.ts tests/route-progress.test.ts tests/top-bar.test.ts`
Expected: FAIL, cannot resolve the three new modules.

- [ ] **Step 3: Implement the math, the script, the top bar, and the progress styles**

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/route-math.test.ts tests/route-progress.test.ts tests/top-bar.test.ts`
Expected: 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add scroll progress along the route and the top bar"
```

### Task 6: Project rows

**Files:**
- Create: `src/components/ProjectRow.astro`, `src/components/Projects.astro`
- Test: `tests/projects.test.ts`

**Interfaces:**
- Consumes: `projects`, `stopById` (Task 1); `renderDoc` (Task 2).
- Produces: `ProjectRow` props `{ project: Project }` → `<article class="project" id="project-{slug}">` with `<p class="marker"><span class="city">{city}</span> <span class="date">{date}</span></p>`, `<h3>{name}</h3>`, `<p class="summary">`, `<p class="part">My part: {part}</p>`, `<p class="stack">{stack joined with ", "}</p>`, `<p class="result">`, and `<p class="links">` with one `<a>` per link. `Projects` (no props) → `<section id="projects" aria-labelledby="projects-title">` with `<h2 id="projects-title">Projects</h2>` and one row per project.
- Layout: from 640 px up, two columns (132 px marker | content); the marker carries a short route-colored segment and a hollow dot drawn in CSS. Below 640 px the marker sits above the content. Rows have no box or border, only a hairline between them.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/projects.test.ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/projects.test.ts`
Expected: FAIL, cannot resolve `../src/components/ProjectRow.astro`.

- [ ] **Step 3: Implement both components**

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/projects.test.ts`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add project rows"
```

### Task 7: Skills filter and mini routes

**Files:**
- Create: `src/components/MiniRoute.astro`, `src/components/SkillsFilter.astro`, `src/scripts/skills-filter.ts`
- Test: `tests/skills.test.ts`, `tests/skills-filter.test.ts`

**Interfaces:**
- Consumes: `skills`, `categoryLabels`, `stops` (Task 1); `renderDoc`, `renderWindow` (Task 2).
- Produces: `MiniRoute` props `{ usedAt: StopId[] }` → `<span class="mini-route" role="img" aria-label="Used in {used cities joined with ', '}">` with one `<span class="mini-dot">` per stop in route order, `data-used` on the used ones (filled route color; unused are hollow with a track-colored border). `SkillsFilter` (no props) → `<section id="skills" aria-labelledby="skills-title">` with `<h2 id="skills-title">Skills</h2>`; `<div class="filters" role="group" aria-label="Filter skills" hidden>` holding `<button type="button" data-filter="all" aria-pressed="true">All</button>` then one `<button type="button" data-filter="{category}" aria-pressed="false">{label}</button>` per category; `<p class="legend">Dots follow the route: {all cities joined with ', '}</p>`; and `<ul class="skills">` with `<li data-category="{category}"><span class="skill">{name}</span><MiniRoute usedAt={usedAt} /></li>` per skill; plus `<script>` that imports and calls `initSkillsFilter()`.
```ts
// src/scripts/skills-filter.ts
export function initSkillsFilter(root?: Document): void;
// removes `hidden` from .filters; a click sets aria-pressed="true" on the clicked button and "false" on the rest,
// and sets `hidden` on every li[data-category] whose category differs (none for "all")
```

- [ ] **Step 1: Write the failing tests**

```ts
// tests/skills.test.ts
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
```
```ts
// tests/skills-filter.test.ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/skills.test.ts tests/skills-filter.test.ts`
Expected: FAIL, cannot resolve `../src/components/SkillsFilter.astro`.

- [ ] **Step 3: Implement the components and the script**

Skill rows: name left, mini route right (96 px wide, 9 px dots on a 2 px track line), hairline between rows, two columns from 640 px up. Selected filter button: white text on `var(--route)`; others: ink text with a track-colored border.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/skills.test.ts tests/skills-filter.test.ts`
Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add the skills filter with mini routes"
```

### Task 8: About, the contact stop, page assembly, and assets

**Files:**
- Create: `src/components/About.astro`, `src/components/NextStop.astro`, `public/favicon.svg`, `public/Rafiq_Clive_Resume.pdf`, `scripts/make-og.mjs`, `public/og.png` (generated)
- Modify: `src/pages/index.astro`
- Test: `tests/page.test.ts`, `tests/og.test.ts`

**Interfaces:**
- Consumes: every component above; `profile` (Task 1); `renderDoc` (Task 2).
- Produces: `About` → `<section id="about" aria-labelledby="about-title">` with `<h2 id="about-title" class="visually-hidden">About</h2>` and one `<p>` per `profile.about` item. `NextStop` → `<section id="contact" class="next-stop" aria-labelledby="contact-title">` with `<span class="dot dashed" aria-hidden="true">` (a 2 px dashed route-colored ring, reached by a short dashed route segment), `<h2 id="contact-title">Next: 2027 internship</h2>`, and `<ul class="contact-links">` with Email (`mailto:`), LinkedIn, GitHub, and Resume links from `profile`. `index.astro`: `<Base title="Clive Rafiq, backend engineer" description="Backend engineer and Computer Systems Engineering student at ASU, shipping production systems from Jakarta to New York.">` → `<TopBar />`, then `<main class="wrap">` with `<Hero />`, `<About />`, `<RouteSpine />`, `<Projects />`, `<SkillsFilter />`, `<NextStop />`.
```js
// scripts/make-og.mjs
export async function renderOg(outFile = 'public/og.png'): Promise<void>; // also runs when executed directly
```

- [ ] **Step 1: Confirm which resume to publish**

The uploaded `Rafiq_Clive_Resume.pdf` includes Clive's phone number. Ask whether to publish it as is or use a version without the number, then copy the approved file to `public/Rafiq_Clive_Resume.pdf`.

- [ ] **Step 2: Write the failing tests**

```ts
// tests/page.test.ts
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
```
```ts
// tests/og.test.ts
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { renderOg } from '../scripts/make-og.mjs';

test('renders a 1200 × 630 PNG', async () => {
  const out = join(tmpdir(), 'og-test.png');
  await renderOg(out);
  const png = readFileSync(out);
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
}, 20_000);
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run tests/page.test.ts tests/og.test.ts`
Expected: FAIL; the placeholder page has no `#top` section and `scripts/make-og.mjs` does not exist.

- [ ] **Step 4: Implement**

`make-og.mjs`: decompress `node_modules/@fontsource/overpass/files/overpass-latin-{400,500}-normal.woff2` with `wawoff2.decompress` into `scripts/.fonts/overpass-{400,500}.ttf`, then render with `new Resvg(svg, { font: { fontFiles: [...], loadSystemFonts: false, defaultFontFamily: 'Overpass' } })`. Use `fontFiles`: in resvg-js 2.6.2 `fontBuffers` is silently ignored and the text falls back to a system sans (verified). The SVG is 1200 × 630 on the page color: "Clive Rafiq" at 56 px/500 in ink at (80, 150); the headline at 40 px/400 in ink on two lines ("Backend engineer." and "Shipping at every stop, from Jakarta to New York."); a 6 px route-colored line from x 140 to 1060 at y 470 with four hollow stop dots (r 12, 6 px stroke) evenly spaced and the four city names centered below in muted 26 px. `favicon.svg`: 32 × 32, page-colored rounded square (rx 7), a 3 px route-colored line from (6, 16) to (26, 16), and three route-colored dots (r 3.5) at x 8, 16, and 24. Run `npm run og` to write `public/og.png`.

- [ ] **Step 5: Run the tests and the build**

Run: `npm test && npm run build`
Expected: all tests in `tests/` pass (40 so far); the build completes with 0 `astro check` errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: assemble the page with about, contact, and assets"
```

### Task 9: Built-site checks, README, and deploy workflow

**Files:**
- Create: `tests/site/built-site.test.ts`, `README.md`, `.github/workflows/deploy.yml`
- Modify: whichever component a failing check points at

**Interfaces:**
- Consumes: `dist/` from `astro build` (run by `npm run test:site`).

- [ ] **Step 1: Write the checks**

```ts
// tests/site/built-site.test.ts
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
  for (const f of ['favicon.svg', 'og.png', 'Rafiq_Clive_Resume.pdf']) expect(existsSync(`dist/${f}`), f).toBe(true);
});
test('axe finds no violations it can check without a browser', async () => {
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  dom.window.eval(readFileSync('node_modules/axe-core/axe.min.js', 'utf8'));
  const axe = (dom.window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: { id: string }[] }> } }).axe;
  const result = await axe.run(dom.window.document as unknown as Document, { rules: { 'color-contrast': { enabled: false } } });
  expect(result.violations.map(v => v.id)).toEqual([]);
});
```

- [ ] **Step 2: Run the checks**

Run: `npm run test:site`
Expected: 7 checks pass. A failure names the rule; fix it in the component that owns the CSS or markup, then rerun until all 7 pass.

- [ ] **Step 3: Write `README.md` and the workflow**

README sections: what the site is; run it (`npm install`, `npm run dev`); test it (`npm test`, `npm run test:site`); add a stop (add the id to `StopId`, add the stop to `stops.ts`, point projects and skills at it, run `npm test`); regenerate the link-preview image (`npm run og`); deploy (push to `main`).

`.github/workflows/deploy.yml`: triggers on push to `main` and `workflow_dispatch`; permissions `contents: read`, `pages: write`, `id-token: write`; three jobs. `test`: checkout, setup-node with Node 22 and npm cache, `npm ci`, `npm test`. `build` (needs `test`): checkout, `withastro/action` with `node-version: 22`. `deploy` (needs `build`): `actions/deploy-pages` in the `github-pages` environment. Copy the current major versions of these actions from Astro's GitHub Pages deployment guide when writing the file; they could not be checked while writing this plan.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "test: built-site checks; docs: README; ci: deploy to GitHub Pages"
```

### Task 10: Preview, visual QA, copy pass, and launch

**Files:**
- Create: `scripts/lib/inline-assets.mjs`, `scripts/build-preview.mjs`
- Test: `tests/inline-assets.test.ts`

**Interfaces:**
```js
// scripts/lib/inline-assets.mjs
export function inlineAssets(html: string, readAsset: (urlPath: string) => Buffer): string;
// inlines <link rel="stylesheet" href="/_astro/…"> as <style>, <script type="module" src="/_astro/…"></script>
// as an inline module script, and url(/_astro/….woff2) inside that CSS as data:font/woff2;base64,…;
// every other URL is left alone
```
`build-preview.mjs` reads `dist/index.html`, inlines from `dist/`, and writes `preview/index.html`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/inline-assets.test.ts
import { expect, test } from 'vitest';
import { inlineAssets } from '../scripts/lib/inline-assets.mjs';

test('inlines stylesheets, module scripts, and fonts, and leaves other links alone', () => {
  const files: Record<string, Buffer> = {
    '/_astro/a.css': Buffer.from('@font-face{src:url(/_astro/f.woff2) format("woff2")}body{color:red}'),
    '/_astro/m.js': Buffer.from('console.log(1)'),
    '/_astro/f.woff2': Buffer.from([0, 1, 2]),
  };
  const out = inlineAssets(
    '<head><link rel="stylesheet" href="/_astro/a.css"></head><body><script type="module" src="/_astro/m.js"></script><a href="/Rafiq_Clive_Resume.pdf">r</a></body>',
    path => files[path],
  );
  expect(out).toContain('<style>@font-face{src:url(data:font/woff2;base64,AAEC) format("woff2")}body{color:red}</style>');
  expect(out).toContain('<script type="module">console.log(1)</script>');
  expect(out).not.toContain('/_astro/');
  expect(out).toContain('href="/Rafiq_Clive_Resume.pdf"');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/inline-assets.test.ts`
Expected: FAIL, cannot resolve `../scripts/lib/inline-assets.mjs`.

- [ ] **Step 3: Implement `inlineAssets` and `build-preview.mjs`**

- [ ] **Step 4: Run it to verify it passes, then build the preview**

Run: `npx vitest run tests/inline-assets.test.ts && npm run build && npm run preview:file && grep -c "/_astro/" preview/index.html`
Expected: 1 test passes; grep prints `0`; `preview/index.html` is under 16 MB.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "build: single-file preview for review"
```

- [ ] **Step 6: Publish the preview**

Copy `preview/index.html` to `/mnt/user-data/outputs/portfolio-preview/index.html` and publish it with the Artifact tool; Clive approves the publish card. Later republishes pass the artifact's URL so the same link updates.

- [ ] **Step 7: Visual QA in Chrome on the published preview**

At 1280 × 800 and 375 × 812, screenshot the hero, each stop, projects, skills, and contact, and compare them with the approved sketches: light route-first hero, years on each stop, project rows hanging off their stops, mini routes on skills, dashed contact stop. At 320 × 640, run `document.documentElement.scrollWidth <= window.innerWidth`; expected `true`. Tab through the page; the focus ring shows on every stop link, filter button, and project link. Click New York in the top route; the New York heading sits fully below the sticky bar. Fix each issue in its component, rerun `npm test && npm run test:site`, commit, and republish.

- [ ] **Step 8: Copy pass with Clive**

Walk through the headline, about, project summaries, and entry lines with him. Numbers, dates, names, and the award wording stay locked to the spec tables unless he corrects them. Apply his edits in `src/data/`, run `npm test`, and commit `copy: final pass`.

- [ ] **Step 9: Hand off for launch**

Zip the repository, including `.git`, and present it. Clive creates the public repo `cliverafiq/cliverafiq.github.io`, sets Settings, Pages, Source to GitHub Actions, and pushes `main`. Expected: the workflow's test, build, and deploy jobs pass, and https://cliverafiq.github.io serves the site.

- [ ] **Step 10: Post-launch checks**

PageSpeed Insights on the live URL scores 95 or higher on mobile for performance, accessibility, best practices, and SEO. LinkedIn's Post Inspector shows the preview image. Every external link opens. Tick the spec's quality checklist.

---

## Amendment: Revision 2 (bolder design)

Implements the spec's "Revision 2" section. Same Global Constraints, except the token list grows to eight (`routeOnDark` #7C9BFF, `mutedOnDark` #A7B3C3) and the type sizes follow Revision 2. New dependencies: `world-atlas@2.0.2`, `topojson-client@3.1.0`, `d3-geo@3.1.1`, dev `@types/d3-geo@3.1.1`, `@types/topojson-client@3.1.5`. Task 10 Steps 6–10 run again after Task 14.

### Task 11: Map geometry and stop coordinates

**Files:** Create `src/lib/geo.ts`; Modify `src/data/types.ts`, `src/data/stops.ts`; Test `tests/geo.test.ts`
**Interfaces:**
```ts
export const MAP: { lon0: 60; lon1: 310; lat0: 68; lat1: -18; cols: 100; rows: 34; width: 1000; height: 357 };
export function project(lon: number, lat: number): { x: number; y: number }; // fractions of the Pacific-centred crop
export function landDots(): { x: number; y: number }[];                       // land cell centres, as fractions
export function dotsPath(dots: { x: number; y: number }[]): string;           // "M{x} {y}h0" per dot, viewBox units, 1 dp
export function routePath(points: { x: number; y: number }[]): string;        // M + one Q per hop; control above the higher end by 35% of the hop
export function formatCoords(lat: number, lon: number): string;               // "6.2° S, 106.8° E"
// Stop gains lat: number; lon: number
```
Tests: Jakarta projects to (0.1872, 0.8628) and Tempe to (0.7524, 0.4023); `landDots()` has 1,191 dots; the route through the four stops starts `M187.2 308` and has three `Q` hops; coordinates format as "6.2° S, 106.8° E" and "40.7° N, 74.0° W".

### Task 12: World-route hero

**Files:** Create `src/components/WorldRoute.astro`; Modify `src/components/Hero.astro`, `src/styles/global.css`, `tests/hero.test.ts`; Delete `src/components/TopRoute.astro`
**Interfaces:** `WorldRoute` (no props) → `div.world-route` holding an `aria-hidden` `svg viewBox="0 0 1000 357"` with `path.land`, `path.route` (`pathLength="1"`, CSS draw on load), `path.next` (dashed), and four `circle.marker`; an `ol.top-route` of `li[style="--x;--y"]` > `a[href="#stop-{id}"]` > `.city` + `.years`; and `ul.wins` of `li` > `.city` + `.win`. The hero `h1` is `.visually-hidden`.
Tests: stops link in journey order; the wins strip lists the four wins in order; the map has land, one route, and four markers; nothing waits for a script; the name is visually hidden.

### Task 13: Bolder experience route with coordinates

**Files:** Modify `src/components/RouteSpine.astro`, `tests/route-spine.test.ts`
Tests: each stop shows its coordinates ("6.2° S, 106.8° E" for Jakarta, "40.7° N, 74.0° W" for New York).

### Task 14: Projects on a dark band

**Files:** Modify `src/styles/tokens.ts`, `src/data/types.ts` (`Project.figure: { value: string; label: string }`), `src/data/projects.ts`, `src/components/ProjectRow.astro`, `src/components/Projects.astro`, `src/pages/index.astro`, and the tests for contrast, base layout, projects, and page order.
Figures: SlackDB "Winner" / "AutoDB track, VillageHacks"; Drift "48 hours" / "build time at StarkHacks"; MRI denoising "+11 dB" / "PSNR across about 3,000 MRI slices".
Tests: the two dark tokens reach 4.5:1 on ink; `tokenStyle` carries eight tokens; each row shows its figure; the projects section is marked `data-tone="dark"` and spans the full width; sections still run in spec order.

## Amendment: Revision 3

### Task 15: Internships stand out on the route

**Files:** Modify `src/data/types.ts` (`Entry.line` becomes optional; `Entry.points?: string[]`), `src/data/stops.ts`, `src/components/RouteSpine.astro`, `tests/data.test.ts`, `tests/route-spine.test.ts`
Bullets come from the resume: World Salon 4, BFI Finance 3, PhysioActive Indonesia 2; those entries render as `li.work` with `.org`, `.role`, and `ul.points`.
Tests: every entry has either a line or points; internships carry their bullets in resume order; the route renders them as `li.work`, other entries keep `.line`.

### Task 16: Hero buttons

**Files:** Modify `src/components/Hero.astro`, `src/styles/global.css` (`.button`, `.button.primary`), `tests/hero.test.ts`
Tests: Resume is `a.button.primary`; GitHub is `a.button` without `primary`.

## Amendment: Revision 4

### Task 17: New experience, projects, and skills

**Files:** Modify `src/data/types.ts` (`Project.figure` optional, `Project.image?: { src; alt; width; height }`, an entry may have neither line nor points), `src/data/stops.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/components/RouteSpine.astro` (line only when present), `src/components/ProjectRow.astro` (photo in the figure slot), `public/projects/assistive-wearable.jpg`, and the data, route, projects, skills, filter, and built-site tests.
Tests: route order with the new entries; the SEDS entry shows its role alone; five projects in order; each project leads with exactly one of a figure or a photo; the wearable row shows its photo with alt text and dimensions; 18 skills, with C++ at Tempe and West Lafayette; the photo ships with the site.
