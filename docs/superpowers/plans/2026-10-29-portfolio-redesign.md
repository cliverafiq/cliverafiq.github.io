# Portfolio Redesign (the Stack) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the world-route portfolio with the "from chip to cloud" design: a five-layer 3D stack pinned beside Clive's work, lighting up the layers of whichever entry the reader is on.

**Architecture:** Static Astro page assembled from small components. Content lives in two data files (`layers.ts`, `work.ts`), and the stack, tags, layer links, and phone layer bar all read from them. The stack is HTML plates tilted with CSS 3D transforms. A CSS-only animation splits it on load, and one small script lights layers on scroll, runs the pulse, tilts toward the cursor, and closes the stack at Contact. The page is complete without the script.

**Tech Stack:** Node 22.12+ (local is 25.9), Astro 7.3.5, TypeScript 6.0.3 with @astrojs/check 0.9.10, plain CSS, @fontsource/bricolage-grotesque 5.3.0, @fontsource/geist 5.3.0, @fontsource/geist-mono 5.3.0, Vitest 5.0.3 with jsdom 30.1.2 and axe-core 4.14.0, @resvg/resvg-js 2.6.2 and wawoff2 2.0.1 for the link-preview image, GitHub Actions to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-29-portfolio-redesign-design.md`. Its tables are the source of every content string, color, and layer assignment. Prototypes: `.superpowers/brainstorm/91504-1793226320/content/stack-structure.html` (option B is the approved structure) and `concepts.html` (concept 3 is the approved look). They are not committed.

## Global Constraints

- **Branch:** work on `redesign-stack` (already created, spec committed). The live site changes only when the branch merges to `main`.
- **Commits:** every commit message ends with these two lines:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01CpKg3X5aamTrM3vRthchiB
  ```
- **Page tokens:** page `#ECEAE4`, ink `#121212`, muted `#55534D`, hairline `#CFCBC2`. They are defined once in `src/styles/tokens.ts`, and `Base.astro` sets them on `<html>`. The theme is light only.
- **Layer colors:** these live only in `src/data/layers.ts`, applied per element as `--c` (fill) and `--t` (text).

  | Layer | Fill (`--c`) | Text (`--t`) |
  | --- | --- | --- |
  | Hardware | `#1E7A50` | `#E9FFF3` |
  | Firmware | `#2A2F3A` | `#E7EAF0` |
  | Services | `#2B59FF` | `#F0F3FF` |
  | Data | `#FF7A1A` | `#1E0D00` |
  | Product | `#DFFF4F` | `#141600` |

  All pairs were measured at 4.77:1 or higher.
- **Fonts:** all served from the site through Fontsource. No Google Fonts requests.
  - Bricolage Grotesque, weights 500 and 800, for display.
  - Geist, weights 400 and 500, for body text.
  - Geist Mono, weight 500, for tech names and tags.
  - Numbers use `font-variant-numeric: tabular-nums`.
- **3D and motion:** CSS 3D transforms on HTML elements only. No 3D or animation library, and no runtime dependencies beyond the fonts.
- **Text rules:**
  - Page text never contains `·` or `→`.
  - No arrows on links.
  - Text lines stay under 70 characters.
- **Motion values:**
  - Load split takes about 1 s, staggered.
  - The active entry is the one crossing the vertical middle of the window (`PROBE_RATIO = 0.5`).
  - Lit layers lift 20 px; the rest dim to 30% opacity and lose saturation; transitions take 300 ms.
  - A pulse runs along the traces when the lit layers change.
  - Tilt is at most 4°, on fine pointers only.
  - At Contact, every layer lights and the stack closes into a solid block.
- **Reduced motion:**
  - The stack starts split.
  - Highlights change instantly.
  - No lift, pulse, tilt, or closing. The script still lights layers.
- **Without JavaScript:**
  - The stack shows split with every layer lit.
  - All content is visible.
  - Layer links are plain anchors that work.
  - Nothing starts hidden outside the load animation.
- **Breakpoint:** 900 px wide. Below it, the page is one column with the phone layer bar.
- **Copy:**
  - Strings come from the spec tables, as written into `work.ts` and `profile.ts` in Task 2.
  - No invented numbers.
  - Everything stays draft until the copy pass in Task 11.
- **Testing:**
  - Tests run in Vitest's default Node environment.
  - Astro components cannot render under `@vitest-environment jsdom` (the container throws NoMatchingRenderer). Component tests use `tests/helpers/render.ts`.
  - Script tests build an explicit `new JSDOM(...)` window and pass it in, as `tests/route-progress.test.ts` did.
- **Commands:**
  - `npm test` runs unit and component tests.
  - `npm run build` runs `astro check` and then `astro build`.
  - `npm run test:site` builds, then checks `dist/`.
  - `tests/site/built-site.test.ts` still encodes the old design until Task 10. Do not run `npm run test:site` before then.

## Review Focus

1. **Late layout:** web fonts and images move entries after the first measurement, so the wrong layer stays lit. The script must measure again on `load`, `resize`, and `document.fonts.ready`. Pinned in Task 8.
2. **Reload, back-navigation, or a deep link** such as `#entry-drift`: the lit layers must match the current scroll position immediately, not the top of the page. Pinned in Task 8.
3. **Narrow phones (320 px):** the tilted stack is wider than its box and can make the page scroll sideways, and long names such as "SEDS Rocketry Division at ASU" must wrap. Pinned in Tasks 7 and 10, and checked by eye in Tasks 7 and 11.
4. **Keyboard focus on a dimmed plate:** the focused plate must show at full opacity, with no desaturation and with a focus ring. Pinned in Tasks 4 and 10.
5. **Jumps to an entry** (layer links or deep links) must land below the top bar, and below the layer bar on phones. Pinned in Tasks 7 and 10, and checked by eye in Task 11.

---

### Task 1: Clear out the route design

**Files:**
- Delete: everything in `src/components/` (`About`, `Hero`, `MiniRoute`, `NextStop`, `ProjectRow`, `Projects`, `RouteSpine`, `SkillsFilter`, `TopBar`, `WorldRoute`). Hero and TopBar are rewritten in Task 6.
- Delete: `src/scripts/route-progress.ts`, `src/scripts/skills-filter.ts`, `src/lib/geo.ts`, `src/lib/route-math.ts`, `src/data/stops.ts`, `src/data/projects.ts`, `src/data/skills.ts`.
- Delete these tests: `tests/hero.test.ts`, `top-bar`, `route-progress`, `route-spine`, `skills`, `data`, `geo`, `projects`, `page`, `route-math`, `skills-filter`.
- Modify:
  - `src/data/types.ts`: keep only `Profile`.
  - `src/pages/index.astro`: `Base` around an empty `<main></main>`, keeping the current title and description.
  - `scripts/make-og.mjs`: remove the `stops` import, the route line, and the stop marks. Keep the name and headline.
  - `package.json` and `package-lock.json`.

**Interfaces:**
- Produces: a buildable placeholder page. `Base`, `site.ts`, `profile.ts`, `tokens.ts`, `contrast.ts`, the OG script, and the preview script are unchanged in behavior.

- [ ] **Step 1: Delete the files listed above**

Run: `git rm -q src/components/*.astro src/scripts/route-progress.ts src/scripts/skills-filter.ts src/lib/geo.ts src/lib/route-math.ts src/data/stops.ts src/data/projects.ts src/data/skills.ts tests/{hero,top-bar,route-progress,route-spine,skills,data,geo,projects,page,route-math,skills-filter}.test.ts`

- [ ] **Step 2: Remove the map packages**

Run: `npm uninstall d3-geo topojson-client world-atlas @types/d3-geo @types/topojson-client`

Expected: `package.json` no longer lists them. `@fontsource/overpass` stays until Task 9, because the OG script still uses it.

- [ ] **Step 3: Trim `types.ts`, `index.astro`, and `make-og.mjs` as listed under Files**

- [ ] **Step 4: Run the remaining tests and the build**

Run: `npm test && npm run build`

Expected:
- **Tests:** 4 test files pass (`base-layout`, `contrast`, `inline-assets`, `og`).
- **Build:** `astro check` reports 0 errors, and the build writes `dist/index.html`.

- [ ] **Step 5: Commit**

```bash
git add -A src tests scripts package.json package-lock.json
git commit -m "refactor: clear out the world-route design"
```

### Task 2: Content model and palette

**Files:**
- Modify: `src/data/types.ts`, `src/data/profile.ts`, `src/styles/tokens.ts`.
- Create: `src/data/layers.ts`, `src/data/work.ts`.
- Test: `tests/data.test.ts` (new), `tests/contrast.test.ts` (rewrite), `tests/base-layout.test.ts` (token string).

**Interfaces:**
- Produces:
```ts
// src/data/types.ts
export type LayerId = 'hardware' | 'firmware' | 'services' | 'data' | 'product';
export interface Layer { id: LayerId; name: string; color: string; text: string; tech: string[] }
export interface Link { label: 'Code' | 'Demo'; href: string }
export interface Highlight { value: string; label: string }
export interface WorkImage { src: string; alt: string; width: number; height: number }
export interface WorkEntry {
  slug: string;          // anchor id is `entry-${slug}`
  name: string;
  role: string;          // role and place, e.g. 'Backend developer intern, New York'
  dates: string;
  text?: string;         // absent for SEDS (role only)
  highlight?: Highlight; // at most one of highlight, award, image
  award?: string;
  image?: WorkImage;
  layers: LayerId[];     // at least one
  links: Link[];
}
export interface AlsoItem { name: string; dates: string; line: string; link?: Link }
export interface Profile { name: string; headline: string; line: string; email: string; linkedin: string; github: string; resumePath: string }

// src/data/layers.ts
export const layers: Layer[];                 // bottom to top: hardware, firmware, services, data, product
export function layerById(id: LayerId): Layer; // throws Error(`Unknown layer: ${id}`)

// src/data/work.ts
export const work: WorkEntry[];               // page order
export const also: AlsoItem[];
export function firstEntryOn(layer: LayerId): WorkEntry; // first in page order; throws Error(`No entry on layer: ${layer}`)

// src/styles/tokens.ts
export const tokens: { page: '#ECEAE4'; ink: '#121212'; muted: '#55534D'; hairline: '#CFCBC2' };
export const tokenStyle: string;              // '--page:#ECEAE4;--ink:#121212;--muted:#55534D;--hairline:#CFCBC2'
```

- [ ] **Step 1: Write the failing tests**

`tests/data.test.ts`:
```ts
test('layers run bottom to top with the spec colors and tech', () => {
  expect(layers.map(l => [l.id, l.name, l.color, l.text])).toEqual([
    ['hardware', 'Hardware', '#1E7A50', '#E9FFF3'], ['firmware', 'Firmware', '#2A2F3A', '#E7EAF0'],
    ['services', 'Services', '#2B59FF', '#F0F3FF'], ['data', 'Data', '#FF7A1A', '#1E0D00'],
    ['product', 'Product', '#DFFF4F', '#141600'],
  ]);
  expect(layerById('hardware').tech).toEqual(['ESP32', 'Raspberry Pi', 'sensors']);
  expect(layerById('services').tech).toEqual(['Go', 'NATS', 'FastAPI', 'Lambda']);
  expect(() => layerById('cloud' as never)).toThrow('Unknown layer: cloud');
});
test('work runs in the spec order on the spec layers', () => {
  expect(work.map(w => [w.slug, w.name, w.layers])).toEqual([
    ['world-salon', 'World Salon', ['services', 'data']],
    ['bfi-finance', 'BFI Finance', ['services']],
    ['physioactive', 'PhysioActive Indonesia', ['data', 'product']],
    ['slackdb', 'SlackDB', ['data', 'product']],
    ['drift', 'Drift', ['firmware', 'hardware']],
    ['assistive-wearable', 'Assistive wearable', ['hardware']],
    ['seds-rocketry', 'SEDS Rocketry Division at ASU', ['firmware']],
  ]);
});
test('every layer has an entry, and its link goes to the first one', () => {
  expect(layers.map(l => firstEntryOn(l.id).slug)).toEqual(['drift', 'drift', 'world-salon', 'world-salon', 'physioactive']);
});
test('each entry leads with at most one of a highlight, an award, or a photo', () => {
  for (const w of work) expect([w.highlight, w.award, w.image].filter(Boolean).length, w.slug).toBeLessThanOrEqual(1);
  expect(work.filter(w => w.highlight).map(w => w.highlight!.value)).toEqual(['2', '6,000', '−77%', '48 hours']);
  expect(work.find(w => w.slug === 'slackdb')?.award).toBe('AutoDB track winner');
  expect(work.find(w => w.slug === 'assistive-wearable')?.image?.src).toBe('/projects/assistive-wearable.jpg');
  const seds = work.find(w => w.slug === 'seds-rocketry')!;
  expect([seds.text, seds.highlight, seds.award, seds.image]).toEqual([undefined, undefined, undefined, undefined]);
});
test('links use https, and SlackDB keeps its code and demo', () => {
  for (const link of [...work.flatMap(w => w.links), ...also.flatMap(a => (a.link ? [a.link] : []))]) expect(link.href).toMatch(/^https:\/\//);
  expect(work.find(w => w.slug === 'slackdb')?.links).toEqual([
    { label: 'Code', href: 'https://github.com/cliverafiq/SlackDB' }, { label: 'Demo', href: 'https://slackdb.vercel.app/' },
  ]);
});
test('also lists the three smaller pieces in order', () => {
  expect(also.map(a => [a.name, a.link?.href])).toEqual([
    ['MRI denoising research', 'https://github.com/cliverafiq/mri-tumor-segmentation'],
    ['k-Chinese Postman routing research', 'https://github.com/cliverafiq/postman'],
    ['TechTrek Indonesia', undefined],
  ]);
});
test('profile carries the draft headline, and no string uses a middle dot or arrow', () => {
  expect(profile.headline).toBe('I build backend systems, and I know what runs under them.');
  expect(JSON.stringify({ layers, work, also, profile })).not.toMatch(/·|→/);
});
```

`tests/contrast.test.ts`: keep the WCAG reference test, then add:
```ts
test('ink and muted meet AA on the page', () => {
  for (const fg of [tokens.ink, tokens.muted]) expect(contrastRatio(fg, tokens.page)).toBeGreaterThanOrEqual(4.5);
});
test('every layer text meets AA on its own color', () => {
  for (const l of layers) expect(contrastRatio(l.text, l.color), l.id).toBeGreaterThanOrEqual(4.5);
});
```

`tests/base-layout.test.ts`: the expected root style becomes `'--page:#ECEAE4;--ink:#121212;--muted:#55534D;--hairline:#CFCBC2'`.

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/data.test.ts tests/contrast.test.ts tests/base-layout.test.ts`

Expected: FAIL. `layers.ts` and `work.ts` don't exist, and the token string differs.

- [ ] **Step 3: Write the data**

- **`layers.ts`:** use the values from the Global Constraints table.
  - Hardware tech: `['ESP32', 'Raspberry Pi', 'sensors']`
  - Firmware tech: `['C++', 'WebSerial']`
  - Services tech: `['Go', 'NATS', 'FastAPI', 'Lambda']`
  - Data tech: `['DynamoDB', 'PostgreSQL', 'BigQuery']`
  - Product tech: `['Dashboards', 'Slack bot']`
- **`tokens.ts`:** the four page tokens. `tokenStyle` keeps its current construction.
- **`work.ts` and `profile.ts`:** use exactly this draft copy, from the spec table. Keep the `−` (U+2212) in "−77%".

```ts
// work.ts
export const work: WorkEntry[] = [
  { slug: 'world-salon', name: 'World Salon', role: 'Backend developer intern, New York', dates: 'May – Aug 2026',
    text: 'Traced two production-blocking failures: an ASGI adapter that failed every request under Python 3.12, and JWKS auth fetches breaking across containers. Shipped per-recipient read and unread tracking on FastAPI, Lambda, and DynamoDB, and built a Bash harness that exposed a race condition.',
    highlight: { value: '2', label: 'production blockers traced' }, layers: ['services', 'data'], links: [] },
  { slug: 'bfi-finance', name: 'BFI Finance', role: 'Backend intern, Jakarta', dates: 'Dec 2025 – Jan 2026',
    text: 'Built an event-driven Go service on NATS that caches WhatsApp customer media in object storage, extending retention from two weeks to indefinite. Deployed it with Docker and Kubernetes into the production loan workflow.',
    highlight: { value: '6,000', label: 'loan officers use that workflow daily' }, layers: ['services'], links: [] },
  { slug: 'physioactive', name: 'PhysioActive Indonesia', role: 'Full-stack intern, Jakarta', dates: 'Jul 2024 – Jan 2025',
    text: 'Built Python ETL pipelines in BigQuery that classified 10,000+ customer messages with an LLM, giving the CEO same-day results. Launched a Flask dashboard of customer messages and metrics.',
    highlight: { value: '−77%', label: 'employee response time, measured with test messages before and after launch' }, layers: ['data', 'product'], links: [] },
  { slug: 'slackdb', name: 'SlackDB', role: 'VillageHacks at ASU', dates: 'Apr 2026',
    text: 'Text-to-SQL in Slack, with guardrails for LLM-written SQL: risk-scored migrations, sandbox validation, rollback detection, and approver enforcement. I built the guardrails and the FastAPI backend.',
    award: 'AutoDB track winner', layers: ['data', 'product'],
    links: [{ label: 'Code', href: 'https://github.com/cliverafiq/SlackDB' }, { label: 'Demo', href: 'https://slackdb.vercel.app/' }] },
  { slug: 'drift', name: 'Drift', role: 'StarkHacks at Purdue', dates: 'Apr 2026',
    text: 'A passive focus tracker. I wrote the ESP32 firmware in C++ and a two-way WebSerial protocol, learning both during the hackathon.',
    highlight: { value: '48 hours', label: 'to build' }, layers: ['firmware', 'hardware'],
    links: [{ label: 'Code', href: 'https://github.com/cliverafiq/Drift' }] },
  { slug: 'assistive-wearable', name: 'Assistive wearable', role: 'ASU', dates: 'Aug – Nov 2025',
    text: 'A smartwatch alternative for visually impaired users that gives the time, temperature, and compass direction through sound and touch.',
    image: { src: '/projects/assistive-wearable.jpg', alt: 'The assistive wearable on a wrist, with its buttons, speaker, vibration output, Velcro straps, and battery pack labeled', width: 394, height: 324 },
    layers: ['hardware'], links: [] },
  { slug: 'seds-rocketry', name: 'SEDS Rocketry Division at ASU', role: 'Firmware engineer', dates: 'Aug 2026 – now', layers: ['firmware'], links: [] },
];
export const also: AlsoItem[] = [
  { name: 'MRI denoising research', dates: 'Aug – Dec 2025', line: 'PSNR up about 11 dB across about 3,000 MRI slices', link: { label: 'Code', href: 'https://github.com/cliverafiq/mri-tumor-segmentation' } },
  { name: 'k-Chinese Postman routing research', dates: 'Dec 2023 – Nov 2024', line: 'Route cost down by up to 22%', link: { label: 'Code', href: 'https://github.com/cliverafiq/postman' } },
  { name: 'TechTrek Indonesia', dates: 'Aug 2023 – Feb 2025', line: 'Co-founder; Python and VEX Robotics workshops for 30 students' },
];
// profile.ts: drop `about`; email, linkedin, github, resumePath unchanged
headline: 'I build backend systems, and I know what runs under them.',
line: "Computer Systems Engineering at ASU, graduating a year early in May 2028. I've interned in New York and Jakarta, and I'm looking for Summer 2027 internships.",
```

- [ ] **Step 4: Run the tests and the build**

Run: `npm test && npm run build`

Expected: every test file passes, and `astro check` reports 0 errors. `make-og.mjs` still reads `tokens.page` and `tokens.ink`, which exist.

- [ ] **Step 5: Commit**

```bash
git add src/data src/styles/tokens.ts tests
git commit -m "feat: layers, work entries, and the new palette"
```

### Task 3: Stack state logic

**Files:**
- Create: `src/lib/stack-state.ts`
- Test: `tests/stack-state.test.ts`

**Interfaces:**
- Produces:
```ts
export const PROBE_RATIO = 0.5;
export interface StackMarks { entryTops: number[]; entriesEnd: number; contactTop: number } // page coordinates
export interface StackView { active: number; closed: boolean } // active = entry index, or -1 when no entry is active (every layer lit)
export function stackView(marks: StackMarks, probe: number): StackView;
export function tiltFor(x: number, y: number, width: number, height: number, max?: number): { rx: number; rz: number }; // degrees, max defaults to 4
```

Rules:
- **`stackView`:**
  - `active` is the last entry whose top is at or above the probe, as long as `probe < entriesEnd`. Otherwise it is -1.
  - `closed` is `probe >= contactTop`.
- **`tiltFor`:**
  - `rx = (0.5 - y / height) * 2 * max`
  - `rz = (x / width - 0.5) * 2 * max`
  - Both are clamped to [-max, max].

- [ ] **Step 1: Write the failing tests**

```ts
const marks = { entryTops: [1000, 1600, 2200], entriesEnd: 2800, contactTop: 3400 };
test('above the first entry, no entry is active and the stack is open', () => {
  expect(stackView(marks, 500)).toEqual({ active: -1, closed: false });
});
test('an entry is active from its top until the next one starts', () => {
  expect([1000, 1599, 1600, 2799].map(p => stackView(marks, p).active)).toEqual([0, 0, 1, 2]);
});
test('the Also list lights everything, and Contact closes the stack', () => {
  expect(stackView(marks, 2800)).toEqual({ active: -1, closed: false });
  expect(stackView(marks, 3400)).toEqual({ active: -1, closed: true });
});
test('a short entry still becomes active', () => {
  const short = { entryTops: [1000, 1040, 1600], entriesEnd: 2200, contactTop: 2800 };
  expect([1020, 1040].map(p => stackView(short, p).active)).toEqual([0, 1]);
});
test('tilt is zero at the center and reaches the limit at the corners', () => {
  expect(tiltFor(500, 500, 1000, 1000)).toEqual({ rx: 0, rz: 0 });
  expect(tiltFor(0, 0, 1000, 1000)).toEqual({ rx: 4, rz: -4 });
  expect(tiltFor(1000, 1000, 1000, 1000)).toEqual({ rx: -4, rz: 4 });
  expect(tiltFor(2000, -500, 1000, 1000)).toEqual({ rx: 4, rz: 4 });
  expect(tiltFor(0, 0, 1000, 1000, 2)).toEqual({ rx: 2, rz: -2 });
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/stack-state.test.ts`

Expected: FAIL. The module isn't found.

- [ ] **Step 3: Implement `stackView` and `tiltFor` in `src/lib/stack-state.ts`, following the rules above**

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `npx vitest run tests/stack-state.test.ts`

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stack-state.ts tests/stack-state.test.ts
git commit -m "feat: which entry is active and how far the stack tilts"
```

### Task 4: The stack component

**Files:**
- Create: `src/components/Stack.astro`
- Test: `tests/stack.test.ts`

**Interfaces:**
- Consumes: `layers` and `firstEntryOn` (Task 2).
- Produces markup that Task 8's script relies on:
  - `<nav class="stack" data-stack aria-label="Layers">`.
  - Five `<a class="plate" data-layer={id} href={`#entry-${firstEntryOn(id).slug}`} style={`--i:${index};--c:${color};--t:${text}`}>`, in DOM order from top to bottom (Product first), where `index` is the layer's position in `layers` (Product is 4).
  - Each plate holds `<span class="name">{name}</span>` and `<span class="tech" aria-hidden="true">` with one `<span>` per tech, so the link's name is the layer name.
  - Four `<span class="trace" data-trace aria-hidden="true">`.

- [ ] **Step 1: Write the failing tests**

```ts
test('the stack lists the layers top to bottom, each linking to its first entry', async () => {
  const doc = await renderDoc(Stack);
  const plates = [...doc.querySelectorAll('nav.stack[data-stack][aria-label="Layers"] a.plate')];
  expect(plates.map(a => [a.getAttribute('data-layer'), a.querySelector('.name')?.textContent, a.getAttribute('href')])).toEqual([
    ['product', 'Product', '#entry-physioactive'], ['data', 'Data', '#entry-world-salon'],
    ['services', 'Services', '#entry-world-salon'], ['firmware', 'Firmware', '#entry-drift'], ['hardware', 'Hardware', '#entry-drift'],
  ]);
  expect(plates.map(a => a.getAttribute('style'))).toContain('--i:2;--c:#2B59FF;--t:#F0F3FF');
  expect([...plates[4].querySelectorAll('.tech[aria-hidden="true"] span')].map(s => s.textContent)).toEqual(['ESP32', 'Raspberry Pi', 'sensors']);
});
test('four decorative traces join the layers', async () => {
  const doc = await renderDoc(Stack);
  expect(doc.querySelectorAll('[data-trace][aria-hidden="true"]')).toHaveLength(4);
});
test('nothing in the stack waits for a script to appear', async () => {
  const doc = await renderDoc(Stack);
  expect(doc.querySelector('[hidden], [style*="opacity"], [data-lit], [data-closed]')).toBeNull();
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/stack.test.ts`

Expected: FAIL. The component doesn't exist.

- [ ] **Step 3: Build `Stack.astro` with scoped styles to these values**

Match the look of the approved prototype, sharpened:

| Part | Value |
| --- | --- |
| Plate | 300 × 196 px, radius 14 px, `background: var(--c)`, `color: var(--t)`, 1.5 px border `rgb(0 0 0 / .35)`, `box-shadow: 0 18px 30px rgb(0 0 0 / .18)` |
| Phones (below 900 px) | plate 220 × 144 px and `--gap: 48px` |
| View | `.stack` has `transform-style: preserve-3d` and `transform: rotateX(calc(58deg + var(--rx, 0deg))) rotateZ(calc(-38deg + var(--rz, 0deg)))`. The parent sets the perspective (Task 7). |
| Spacing | plate `transform: translateZ(calc(var(--i) * var(--gap) + var(--lift, 0px)))`, `--gap: 64px`. `.stack[data-closed]` sets `--gap: 5px`. |
| Lit | `.plate[data-on]` sets `--lift: 20px` |
| Dim | `.stack[data-lit] .plate:not([data-on])` uses `opacity: .3; filter: saturate(.3)` |
| Focus | `.plate:focus-visible` uses `opacity: 1; filter: none; outline: 3px solid var(--ink); outline-offset: 4px` |
| Thickness | `::after` slab, 8 px deep, in `color-mix(in srgb, var(--c) 70%, #000)` |
| Text | name in Bricolage Grotesque 800 at 18 px. Tech chips in Geist Mono 500 at 12 px, padding 4px 8px, radius 5 px, background `rgb(0 0 0 / .18)`. |
| Transitions | `transform`, `opacity`, and `filter`, 300 ms ease-out |
| Load | keyframes `split` from `translateZ(calc(var(--i) * 5px))`, 1000 ms `cubic-bezier(.2, .8, .2, 1)`, `animation-delay: calc(var(--i) * 60ms)`, `animation-fill-mode: backwards` |
| Traces | 2 px wide, standing at the four plate corners (`rotateX(-90deg)`, `transform-origin: top`), `4 * var(--gap)` tall, ink at 25%. `[data-pulse="a"]` and `[data-pulse="b"]` on `.stack` run identical keyframes `pulse-a` and `pulse-b`: a 40 px bright segment traveling bottom to top in 400 ms. |
| Reduced motion | `--lift: 0px` (the global rule already stops animations and transitions) |

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `npx vitest run tests/stack.test.ts && npm run build`

Expected: 3 tests pass, and `astro check` reports 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Stack.astro tests/stack.test.ts
git commit -m "feat: the five-layer stack in CSS 3D"
```

### Task 5: Work entries, the Also list, and Contact

**Files:**
- Create: `src/components/WorkEntry.astro`, `src/components/AlsoList.astro`, `src/components/Contact.astro`
- Test: `tests/entries.test.ts`

**Interfaces:**
- Consumes: `work`, `also`, `layerById`, `profile` (Task 2).
- Produces:
  - **`WorkEntry`** (props `{ entry: WorkEntry }`):
    - Renders `<article class="entry" id="entry-{slug}" data-entry data-layers="{layers joined by spaces}">`.
    - Children, in this order: `h3`, `p.meta` (`<span class="role">`, then ", ", then `<span class="dates">`), `p.text`, one of `p.highlight` (`span.value`, `span.label`) / `p.award` / `figure.shot` (`img` with `loading="lazy"`), then `ul.tags`, then `p.links` (`a` per link).
    - Parts with no data are left out.
    - Tags: `ul.tags[aria-label="Layers"]`, with `<li style="--c:…;--t:…">{layer name}</li>` in the entry's layer order.
  - **`AlsoList`:** `<section id="also" data-also aria-labelledby="also-title">`, `h2#also-title` "Also", and `ul.also` with `li` holding `span.name`, `span.dates`, `span.line`, and an optional `a`.
  - **`Contact`:** `<section id="contact" data-contact aria-labelledby="contact-title">`, `h2#contact-title` "Let's talk.", and `p.contact-links` with four links.

- [ ] **Step 1: Write the failing tests**

```ts
const shape = (el: Element) => [...el.children].map(c => c.tagName.toLowerCase() + (c.className ? `.${c.className}` : ''));
const entry = (slug: string) => work.find(w => w.slug === slug)!;

test('an internship shows its meta, text, highlight, and layer tags', async () => {
  const el = (await renderDoc(WorkEntry, { entry: entry('world-salon') })).querySelector('article#entry-world-salon[data-entry]')!;
  expect(el.getAttribute('data-layers')).toBe('services data');
  expect(shape(el)).toEqual(['h3', 'p.meta', 'p.text', 'p.highlight', 'ul.tags']);
  expect([el.querySelector('.meta .role')?.textContent, el.querySelector('.meta .dates')?.textContent]).toEqual(['Backend developer intern, New York', 'May – Aug 2026']);
  expect(el.querySelector('.highlight .value')?.textContent).toBe('2');
  expect([...el.querySelectorAll('.tags li')].map(li => [li.textContent, li.getAttribute('style')])).toEqual([
    ['Services', '--c:#2B59FF;--t:#F0F3FF'], ['Data', '--c:#FF7A1A;--t:#1E0D00'],
  ]);
});
test('SlackDB shows its award and links', async () => {
  const el = (await renderDoc(WorkEntry, { entry: entry('slackdb') })).querySelector('article')!;
  expect(shape(el)).toEqual(['h3', 'p.meta', 'p.text', 'p.award', 'ul.tags', 'p.links']);
  expect([...el.querySelectorAll('.links a')].map(a => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Code', 'https://github.com/cliverafiq/SlackDB'], ['Demo', 'https://slackdb.vercel.app/'],
  ]);
});
test('the wearable shows its photo, and SEDS shows its role alone', async () => {
  const wearable = (await renderDoc(WorkEntry, { entry: entry('assistive-wearable') })).querySelector('article')!;
  expect(shape(wearable)).toEqual(['h3', 'p.meta', 'p.text', 'figure.shot', 'ul.tags']);
  expect(wearable.querySelector('img')?.getAttribute('alt')).toMatch(/^The assistive wearable on a wrist/);
  const seds = (await renderDoc(WorkEntry, { entry: entry('seds-rocketry') })).querySelector('article')!;
  expect(shape(seds)).toEqual(['h3', 'p.meta', 'ul.tags']);
});
test('also lists three items, linking code where it exists', async () => {
  const doc = await renderDoc(AlsoList);
  expect(doc.querySelector('section#also[data-also] h2')?.textContent).toBe('Also');
  expect([...doc.querySelectorAll('ul.also li')].map(li => [li.querySelector('.name')?.textContent, li.querySelector('a')?.getAttribute('href') ?? null])).toEqual([
    ['MRI denoising research', 'https://github.com/cliverafiq/mri-tumor-segmentation'],
    ['k-Chinese Postman routing research', 'https://github.com/cliverafiq/postman'],
    ['TechTrek Indonesia', null],
  ]);
});
test('contact offers four ways to reach Clive', async () => {
  const contact = (await renderDoc(Contact)).querySelector('section#contact[data-contact]')!;
  expect(contact.querySelector('h2')?.textContent).toBe("Let's talk.");
  expect([...contact.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')])).toEqual([
    ['Email', 'mailto:clive.rafiq@gmail.com'], ['LinkedIn', 'https://www.linkedin.com/in/clive-rafiq'],
    ['GitHub', 'https://github.com/cliverafiq'], ['Resume', '/Rafiq_Clive_Resume.pdf'],
  ]);
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/entries.test.ts`

Expected: FAIL. The components don't exist.

- [ ] **Step 3: Build the three components with scoped styles**

| Part | Value |
| --- | --- |
| Entry | `padding-block: 64px`, plus `min-height: 60vh` at 900 px and wider |
| Name | Bricolage Grotesque 800, 34 px, `letter-spacing: -0.03em`, `overflow-wrap: anywhere` |
| Meta | 15 px, muted |
| Text | Geist 17 px, `max-width: 60ch` |
| Highlight | value in Bricolage Grotesque 800 at 64 px; label at 15 px, muted |
| Award | pill in Bricolage Grotesque 800 at 15 px, on the Product lime (`#DFFF4F`) with `#141600` text |
| Photo | `max-width: 100%`, radius 12 px |
| Tags | Geist Mono 500 at 12 px, `padding: 4px 9px`, radius 99 px, `background: var(--c)`, `color: var(--t)` |
| Links | ink, underlined |
| Also and Contact headings | Bricolage Grotesque 800, 48 px (34 px below 900 px) |

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `npx vitest run tests/entries.test.ts && npm run build`

Expected: 5 tests pass, and `astro check` reports 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/{WorkEntry,AlsoList,Contact}.astro tests/entries.test.ts
git commit -m "feat: work entries, the also list, and contact"
```

### Task 6: Hero, top bar, and phone layer bar

**Files:**
- Create: `src/components/Hero.astro`, `src/components/TopBar.astro`, `src/components/LayerBar.astro`
- Test: `tests/top.test.ts`

**Interfaces:**
- Consumes: `profile`, `layers`, `firstEntryOn` (Task 2).
- Produces:
  - **`Hero`:**
    - `<header id="top" class="hero" data-hero>`.
    - Visible `h1` with the name, `p.headline`, and `p.line`.
    - `p.hero-links`, with Resume (`class="button primary"`) and GitHub (`class="button"`).
  - **`TopBar`:**
    - `<nav class="topbar" aria-label="Site">`.
    - `a.home[href="#top"]` with the name.
    - Then Resume, GitHub, and Email links.
  - **`LayerBar`:**
    - `<nav class="layer-bar" data-layer-bar aria-label="Layers">`.
    - Five `<a data-layer={id} href="#entry-…" style="--c:…">`, ordered from Hardware to Product, each holding `<span class="visually-hidden">{name}</span>`.
    - Then `<span class="label" data-layer-label aria-hidden="true">All layers</span>`.

- [ ] **Step 1: Write the failing tests**

```ts
test('the hero shows the name, headline, and line, with the resume filled', async () => {
  const doc = await renderDoc(Hero);
  const h1 = doc.querySelector('header#top[data-hero] h1')!;
  expect(h1.textContent?.trim()).toBe('Clive Rafiq');
  expect(h1.classList.contains('visually-hidden')).toBe(false);
  expect(doc.querySelector('.headline')?.textContent?.trim()).toBe(profile.headline);
  expect(doc.querySelector('.line')?.textContent?.trim()).toBe(profile.line);
  expect([...doc.querySelectorAll('.hero-links a')].map(a => [a.textContent?.trim(), a.getAttribute('href'), a.className])).toEqual([
    ['Resume', '/Rafiq_Clive_Resume.pdf', 'button primary'], ['GitHub', 'https://github.com/cliverafiq', 'button'],
  ]);
  expect(doc.querySelector('[hidden], [style*="opacity"]')).toBeNull();
});
test('the top bar links home, the resume, GitHub, and email', async () => {
  const doc = await renderDoc(TopBar);
  expect(doc.querySelector('nav.topbar[aria-label="Site"] a.home[href="#top"]')?.textContent?.trim()).toBe('Clive Rafiq');
  expect([...doc.querySelectorAll('nav.topbar a:not(.home)')].map(a => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
    ['Resume', '/Rafiq_Clive_Resume.pdf'], ['GitHub', 'https://github.com/cliverafiq'], ['Email', 'mailto:clive.rafiq@gmail.com'],
  ]);
});
test('the layer bar has a named segment per layer, chip to cloud', async () => {
  const doc = await renderDoc(LayerBar);
  const segs = [...doc.querySelectorAll('nav.layer-bar[data-layer-bar][aria-label="Layers"] a[data-layer]')];
  expect(segs.map(a => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
    ['Hardware', '#entry-drift'], ['Firmware', '#entry-drift'], ['Services', '#entry-world-salon'],
    ['Data', '#entry-world-salon'], ['Product', '#entry-physioactive'],
  ]);
  expect(doc.querySelector('[data-layer-label]')?.textContent).toBe('All layers');
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/top.test.ts`

Expected: FAIL. The components don't exist.

- [ ] **Step 3: Build the three components**

| Part | Value |
| --- | --- |
| Hero | `min-height: calc(100vh - 64px)` at 900 px and wider, content centered vertically |
| Hero name | Bricolage Grotesque 800, 88 px (52 px below 900 px), `line-height: .92`, `letter-spacing: -0.04em` |
| Headline | Bricolage Grotesque 500, 34 px (24 px below 900 px), `text-wrap: balance` |
| Line | Geist 17 px, muted, `max-width: 52ch` |
| Top bar | sticky at top, height 64 px (`--bar`), page background, hairline bottom border, name in Bricolage Grotesque 800 at 18 px, links at 15 px |
| Layer bar | `display: none` at 900 px and wider. Below that: sticky at `top: 64px`, height 48 px, five equal segments with `background: var(--c)`; when `[data-lit]`, segments without `[data-on]` drop to `opacity: .3`. Label in Geist Mono 500 at 13 px. `visibility: hidden` until `[data-show]`. |

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `npx vitest run tests/top.test.ts && npm run build`

Expected: 3 tests pass, and `astro check` reports 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/{Hero,TopBar,LayerBar}.astro tests/top.test.ts
git commit -m "feat: hero, top bar, and the phone layer bar"
```

### Task 7: Assemble the page, with fonts and layout

**Files:**
- Modify: `src/pages/index.astro`, `src/layouts/Base.astro` (font imports), `src/styles/global.css` (rewrite), `package.json` and `package-lock.json` (fonts).
- Test: `tests/page.test.ts`

**Interfaces:**
- Consumes: every component from Tasks 4 to 6, plus `work` (Task 2).
- Produces the page structure Task 8's script reads:
  - `TopBar`, then `LayerBar`, then `<main class="page">`.
  - Inside `main`, in order: `Hero`, then `<aside class="pin"><div class="pin-inner"><Stack /></div></aside>`, then `<section id="work" aria-labelledby="work-title">` (`<h2 id="work-title" class="visually-hidden">Work</h2>` plus one `WorkEntry` per `work` item), then `AlsoList`, then `Contact`.
  - Title: "Clive Rafiq, backend engineer".
  - Description (draft): "Backend engineer and Computer Systems Engineering student at ASU, with production work at World Salon and BFI Finance and projects from firmware to the cloud."

- [ ] **Step 1: Write the failing tests**

```ts
test('the page runs hero, work, also, contact, with the stack pinned beside them', async () => {
  const doc = await renderDoc(Index);
  expect([...doc.querySelectorAll('main > header, main > section')].map(el => el.id)).toEqual(['top', 'work', 'also', 'contact']);
  expect(doc.querySelector('main > aside.pin .pin-inner nav[data-stack]')).not.toBeNull();
  expect(doc.querySelector('nav.topbar + nav[data-layer-bar] + main')).not.toBeNull();
});
test('entries appear in the work order', async () => {
  const doc = await renderDoc(Index);
  expect([...doc.querySelectorAll('#work article[data-entry]')].map(a => a.id)).toEqual(work.map(w => `entry-${w.slug}`));
});
test('every in-page link points at an element on the page', async () => {
  const doc = await renderDoc(Index);
  for (const a of doc.querySelectorAll('a[href^="#"]')) expect(doc.getElementById(a.getAttribute('href')!.slice(1)), a.getAttribute('href')!).not.toBeNull();
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/page.test.ts`

Expected: FAIL. The page is still the Task 1 placeholder.

- [ ] **Step 3: Install the fonts and import them in `Base.astro`**

Run: `npm install --save-exact @fontsource/bricolage-grotesque@5.3.0 @fontsource/geist@5.3.0 @fontsource/geist-mono@5.3.0`

Then, in `Base.astro`, replace the Overpass imports with:
- `@fontsource/bricolage-grotesque/latin-500.css`
- `@fontsource/bricolage-grotesque/latin-800.css`
- `@fontsource/geist/latin-400.css`
- `@fontsource/geist/latin-500.css`
- `@fontsource/geist-mono/latin-500.css`

- [ ] **Step 4: Assemble `index.astro` and rewrite `global.css` to these values**

| Part | Value |
| --- | --- |
| Body | Geist 400 at 17 px, `line-height: 1.55`, ink on page, `-webkit-font-smoothing: antialiased` |
| Page width | `max-width: 1240px`, side padding 32 px (20 px below 900 px) |
| Grid, 900 px and wider | `grid-template-columns: minmax(0, 55fr) minmax(0, 45fr)`, `column-gap: 56px`, areas `"hero pin" "work pin" "also pin" "contact pin"` |
| Grid, below 900 px | one column, areas `"hero" "pin" "work" "also" "contact"` |
| Pin, 900 px and wider | `.pin-inner { position: sticky; top: 64px; height: calc(100vh - 64px); display: grid; place-items: center; perspective: 1700px }` |
| Pin, below 900 px | `.pin { height: 320px; overflow: clip }`, not sticky, same perspective |
| Jump offset | `.entry, #also, #contact { scroll-margin-top: 80px }`, and `128px` below 900 px (the top bar plus the layer bar plus 16 px) |
| Wrapping | `h1, h2, h3 { overflow-wrap: anywhere }` |
| Links and focus | links in ink, underlined, `text-underline-offset: 3px`; `:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px }` |
| Buttons | keep the current `.button` and `.button.primary` rules, recolored: border and fill in ink, page-colored text on the primary |
| Kept as is | `.visually-hidden`, `.dates, time { font-variant-numeric: tabular-nums }`, and the global reduced-motion rule |

- [ ] **Step 5: Run the tests and the build**

Run: `npm test && npm run build`

Expected: every test file passes, and `astro check` reports 0 errors.

- [ ] **Step 6: Check it by eye**

Run `npm run dev`. Then, at http://localhost:4321, take screenshots with Playwright at 1280 × 800 and 375 × 812.

Expected:
- **Laptop:** two columns, with the stack split and pinned on the right as you scroll.
- **Phones:** the smaller stack sits under the hero.

At 320 × 640, `document.documentElement.scrollWidth` must be 320, so nothing scrolls sideways (Review Focus 3).

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/layouts/Base.astro src/styles/global.css package.json package-lock.json tests/page.test.ts
git commit -m "feat: assemble the stack page with its fonts and layout"
```

### Task 8: The stack script

**Files:**
- Create: `src/scripts/stack.ts`
- Modify: `src/components/Stack.astro`. Add `<script>import { initStack } from '../scripts/stack'; initStack();</script>`.
- Test: `tests/stack-script.test.ts`

**Interfaces:**
- Consumes:
  - `stackView`, `tiltFor`, and `PROBE_RATIO` (Task 3).
  - The DOM hooks from Tasks 4 to 7: `[data-stack]` with `a[data-layer]` plates; `[data-entry][data-layers]`; `[data-hero]`; `[data-also]`; `[data-contact]`; `[data-layer-bar]` with `a[data-layer]` and `[data-layer-label]`.
- Produces: `initStack(win: Window = window, schedule: (update: () => void) => void = u => win.requestAnimationFrame(u)): () => void`. It returns a cleanup function.

Behavior on each update:
- **Measure:**
  - The probe is `scrollY + innerHeight * PROBE_RATIO`.
  - Entry tops, `entriesEnd` (the top of `[data-also]`), and `contactTop` come from `getBoundingClientRect().top + scrollY`.
  - Take `stackView` of these.
- **Light:**
  - The lit layers are the active entry's `data-layers`, or none.
  - On `[data-stack]` and `[data-layer-bar]`: toggle `data-lit` (set when anything is lit), and toggle `data-on` on each `[data-layer]` that is lit.
  - The label reads the lit layer names in `layers` order, joined with `" + "`, or "All layers" when none is lit.
- **Close:** toggle `data-closed` on `[data-stack]` from `view.closed`. This is never set under reduced motion.
- **Pulse:**
  - When the lit set differs from the previous update, alternate `data-pulse` on `[data-stack]` between `"a"` and `"b"`.
  - Never on the first update, and never under reduced motion.
- **Layer bar:** toggle `data-show` when the hero's bottom is above 0.
- **Tilt:**
  - Only when `matchMedia('(pointer: fine)')` matches and reduced motion is off.
  - On `pointermove`, set `--rx` and `--rz` on `[data-stack]` as `${n.toFixed(2)}deg`, from `tiltFor(clientX, clientY, innerWidth, innerHeight)`.
- **When to update:**
  - Run once at start.
  - Then on `scroll` (passive), `resize`, `load`, and `document.fonts?.ready`, batched through `schedule`.
- **matchMedia:** guard it, since jsdom lacks it: `win.matchMedia?.(q).matches ?? false`.

- [ ] **Step 1: Write the failing tests**

**Fixture:** build it the way `tests/route-progress.test.ts` did, with a fresh JSDOM per test.
- **Window:** `innerHeight` 1000 and `innerWidth` 1000. A `place(el, top, height)` helper stubs `getBoundingClientRect` against `scrollY`, and a `scroll(y)` helper sets `scrollY` and dispatches `scroll`. The scheduler runs updates synchronously.
- **Layout:**

  | Element | Position |
  | --- | --- |
  | Hero | 0 to 800 |
  | Entries | tops at 1000 (`"services data"`), 1600 (`"services"`), and 2200 (`"firmware hardware"`) |
  | `[data-also]` | 2800 |
  | `[data-contact]` | 3400 |
- **Markup:** a `[data-stack]` holding five `a[data-layer]` and four `[data-trace]`, plus a `[data-layer-bar]` holding five `a[data-layer]` and a `[data-layer-label]`.
- **`media(flags)`:** a helper that stubs `win.matchMedia = q => ({ matches: Boolean(flags[q]) })`.

```ts
const on = (root: string) => $$(`${root} [data-layer][data-on]`).map(a => a.getAttribute('data-layer'));

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
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/stack-script.test.ts`

Expected: FAIL. The module isn't found.

- [ ] **Step 3: Implement `initStack` in `src/scripts/stack.ts`, following the behavior above, and add the script tag to `Stack.astro`**

- [ ] **Step 4: Run the tests and the build**

Run: `npm test && npm run build`

Expected: every test file passes, and `astro check` reports 0 errors.

- [ ] **Step 5: Check the motion by eye**

Run `npm run dev`, then check at 1280 × 800:
- **Scroll:** World Salon lights Services and Data, Drift lights Firmware and Hardware, and the traces pulse on each change.
- **Contact:** the stack closes into a block.
- **Cursor:** the stack tilts slightly toward it.
- **Reduced motion:** emulate it in Playwright with `page.emulateMedia({ reducedMotion: 'reduce' })`. Layers still light, with nothing moving.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/stack.ts src/components/Stack.astro tests/stack-script.test.ts
git commit -m "feat: the stack follows the reader"
```

### Task 9: Link preview, tab icon, and resume

**Files:**
- Modify:
  - `scripts/make-og.mjs`: redraw it, and export `ogSvg()`.
  - `public/favicon.svg`.
  - `public/Rafiq_Clive_Resume.pdf`.
  - `public/og.png`, which is regenerated.
  - `package.json`: remove `@fontsource/overpass`.
- Test: `tests/og.test.ts`

**Interfaces:**
- Consumes: `profile`, `layers`, `tokens` (Task 2).
- Produces: `export function ogSvg(): string` and `export async function renderOg(outFile?: string): Promise<void>`. `renderOg` keeps its current signature.

**The preview image (1200 × 630):**
- Page background.
- Name in Bricolage Grotesque 800 at 76 px, at x 80, y 190.
- Headline in Bricolage Grotesque 500 at 36 px, split after the comma into "I build backend systems," and "and I know what runs under them.", at y 270 and 318.
- On the right, the five layers as stacked rhombi, bottom to top, in the layer colors:
  - center x 900, base y 470, each 62 px higher than the one below;
  - points `(cx, y−70) (cx+170, y) (cx, y+70) (cx−170, y)`;
  - stroke `rgb(0 0 0 / .35)`, 2 px.
- **Fonts for resvg:** the Bricolage Grotesque 500 and 800 latin WOFF2 files, decompressed to TTF the way the current script does.

**Tab icon:** use exactly this SVG:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#ECEAE4"/><g stroke="#121212" stroke-opacity=".35"><path d="M16 17.5 27 22 16 26.5 5 22Z" fill="#2B59FF"/><path d="M16 11.5 27 16 16 20.5 5 16Z" fill="#FF7A1A"/><path d="M16 5.5 27 10 16 14.5 5 10Z" fill="#DFFF4F"/></g></svg>
```

- [ ] **Step 1: Write the failing tests** (add them to `tests/og.test.ts`)

```ts
test('the preview shows the name, both headline lines, and all five layers', () => {
  const svg = ogSvg();
  for (const text of ['Clive Rafiq', 'I build backend systems,', 'and I know what runs under them.']) expect(svg).toContain(text);
  for (const l of layers) expect(svg).toContain(`fill="${l.color}"`);
  expect(svg).not.toContain('Overpass');
});
test('the tab icon is a small stack in the Services, Data, and Product colors', () => {
  const icon = readFileSync('public/favicon.svg', 'utf8');
  for (const c of ['#2B59FF', '#FF7A1A', '#DFFF4F']) expect(icon).toContain(c);
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run tests/og.test.ts`

Expected: FAIL. `ogSvg` isn't exported, and the icon still has the route.

- [ ] **Step 3: Redraw `make-og.mjs` and replace `favicon.svg`. Then swap the resume, regenerate the image, and drop Overpass.**

Run:
```bash
cp ~/Documents/Resume/Rafiq_Clive_Resume.pdf public/Rafiq_Clive_Resume.pdf
md5 -q public/Rafiq_Clive_Resume.pdf   # expect 3fc27036706fd0c68392f73287219728 (the Oct 28 resume)
npm uninstall @fontsource/overpass && npm run og
```

- [ ] **Step 4: Run the tests and look at the image**

Run: `npm test`

Expected: every test file passes. Open `public/og.png` and check by eye that the name, headline, and stack don't overlap.

- [ ] **Step 5: Commit**

```bash
git add scripts/make-og.mjs public/favicon.svg public/og.png public/Rafiq_Clive_Resume.pdf package.json package-lock.json tests/og.test.ts
git commit -m "feat: stack link preview and icon, and the October 28 resume"
```

### Task 10: Built-site checks and README

**Files:**
- Modify: `tests/site/built-site.test.ts` (rewrite), `README.md`

**Interfaces:**
- Consumes: the built `dist/` from `npm run test:site`.

- [ ] **Step 1: Rewrite `tests/site/built-site.test.ts`**

Keep the file's current loading of `html`, `css`, and `outsideKeyframes`. Then write these tests:

```ts
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
```

Keep the existing axe test unchanged.

- [ ] **Step 2: Run the built-site checks**

Run: `npm run test:site`

Expected: all 9 tests pass. If one fails, fix the CSS or markup it names. Don't weaken the test.

- [ ] **Step 3: Update `README.md`**

- **Description:** one line about the stack, from chip to cloud. Drop the Jakarta-to-New-York route.
- **"Add a stop" becomes "Add an entry":**
  1. Add it to `work` in `src/data/work.ts`, in page order, with its layers.
  2. If it introduces new tech, add that to its layer in `src/data/layers.ts`.
  3. Run `npm test`.
- **Design and plan:** link this spec and this plan, and keep the October 5 links marked as the previous design.

- [ ] **Step 4: Commit**

```bash
git add tests/site/built-site.test.ts README.md
git commit -m "test: built-site checks for the stack design; docs: README"
```

### Task 11: Copy pass and launch checks

**Files:**
- Modify: `src/data/work.ts`, `src/data/profile.ts`, `src/pages/index.astro` (description), and any test that pins a string that changes.

- [ ] **Step 1: Edit the copy**

Invoke `copywriting-kit:copy-edit` on `profile.headline`, `profile.line`, the page description, every `work` text and highlight label, and the `also` lines. Instruct it to keep every number, name, date, and claim unchanged, and to keep lines under 70 characters where they show on the page.

- [ ] **Step 2: Check the claims**

Invoke `copywriting-kit:copy-proof-check` with the edited copy plus the text of `~/Documents/Resume/Rafiq_Clive_Resume.pdf` as evidence.

Expected: every claim is supported. Revise any claim that isn't.

- [ ] **Step 3: Get Clive's approval**

Show Clive a before-and-after list. Apply only the wording he approves, update the tests that pin those strings, and run `npm test`.

Expected: every test file passes.

- [ ] **Step 4: Run the launch checks by hand and record each result here**

Run `npm run build && npx astro preview`, then:

- [ ] **Screenshots** at 375 × 812 and 1280 × 800, at the opening screen, mid-page (Drift), and Contact. They match the approved prototype's structure.
- [ ] **No sideways scroll at 320 px:** `scrollWidth` is 320, and "SEDS Rocketry Division at ASU" wraps.
- [ ] **Lighthouse on mobile:** `npx lighthouse http://localhost:4321 --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo` scores 95 or higher in all four.
- [ ] **Keyboard only:** Tab reaches every link, including the five plates and the layer bar, each with a visible ring. A focused dimmed plate shows at full strength.
- [ ] **Jumps:** clicking each plate, and loading `/#entry-drift` directly, lands below the top bar (and the layer bar at 375 px), with the right layers lit.
- [ ] **Reduced motion:** with it emulated, the stack starts split, layers light without moving, and the stack never closes.
- [ ] **JavaScript off:** in a Playwright context with JavaScript disabled, the stack shows split with every layer lit, all text is present, and the plate links jump.
- [ ] **Every link resolves:** each external `href` returns 200 with `curl -sI -o /dev/null -w '%{http_code}'`, and `/Rafiq_Clive_Resume.pdf` serves the October 28 resume.

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "content: copy pass on the stack page"
```

- [ ] **Step 6: Hand off**

Use superpowers:finishing-a-development-branch.

Link previews on LinkedIn and Slack can only be checked after deploy. Note this for Clive: after merging, paste the URL into LinkedIn's Post Inspector and into Slack.
