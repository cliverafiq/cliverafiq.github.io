# Clive Rafiq portfolio redesign: the stack

Oct 29, 2026 · @Clive

This spec replaces `2026-10-05-portfolio-design.md`, which stays in the repo as history. Where the two disagree, this one wins.

## Why a redesign

On October 28, 2026, Clive said the live site (the world-route design, revisions 1 to 4) looks plain, is too long and wordy, and that the route concept isn't working. Three static directions (editorial serif, dark blueprint with system diagrams, bold color tiles) were rejected as not unique enough. He asked for something that feels cool and interesting, with scroll animation.

He chose the "exploded stack" concept from a set of three scroll prototypes, and then the "always on screen" structure from three more. The prototypes are in `.superpowers/brainstorm/` (not committed): `concepts.html` (concept 3) and `stack-structure.html` (option B).

## Goal and audience

Unchanged from version 1. The site exists to help win a Summer 2027 software engineering internship. Within 30 seconds, a recruiter should know that Clive builds backend systems that run in production, and should open at least one project.

- **Audience:** recruiters and engineers screening for software internships.
- **Main message:** backend first. The stack shows range, from hardware to product, but Services and Data carry the most work and the headline says backend.

## Concept: from chip to cloud

Clive studies Computer Systems Engineering and has worked at every layer of a system. The page shows that as a stack of five layers, drawn in 3D and pulled apart:

| Layer (bottom to top) | Color | Text on it | Tech printed on the layer |
| --- | --- | --- | --- |
| Hardware | #1E7A50 | #E9FFF3 | ESP32, Raspberry Pi, sensors |
| Firmware | #2A2F3A | #E7EAF0 | C++, WebSerial |
| Services | #2B59FF | #F0F3FF | Go, NATS, FastAPI, Lambda |
| Data | #FF7A1A | #1E0D00 | DynamoDB, PostgreSQL, BigQuery |
| Product | #DFFF4F | #141600 | Dashboards, Slack bot |

The colors are starting values from the prototype. The contrast test decides the final ones.

The stack stays pinned beside the content for the whole page. Whichever entry the reader is on lights up its layers, and the rest dim. The stack is the one memorable element; everything else stays quiet and readable.

## Page structure and content

All wording is draft until the copy pass. Every number and claim must trace to Clive's resume of October 28, 2026 (`~/Documents/Resume/Rafiq_Clive_Resume.pdf`) or to something Clive confirmed.

On laptops the page has two columns: content on the left (about 55%) and the pinned stack on the right. Top to bottom:

1. **Top bar:** Clive's name on the left; Resume, GitHub, and Email on the right.
2. **Opening screen:**
   - Clive's name, large.
   - Headline. Draft: "I build backend systems, and I know what runs under them."
   - One line: Computer Systems Engineering at ASU, graduating a year early in May 2028; interned in New York and Jakarta; looking for Summer 2027 internships.
   - Resume (filled) and GitHub (outlined) buttons.

   The stack splits apart on load, so all five layers show without scrolling.
3. **Seven entries**, in this order:

| # | Entry | Role, place, dates | What it says | Highlight | Layers | Links |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | World Salon | Backend developer intern, New York, May – Aug 2026 | Traced two production-blocking failures (an ASGI adapter failing every request under Python 3.12, and JWKS auth fetches breaking across containers); shipped per-recipient read and unread tracking on FastAPI, Lambda, and DynamoDB; built a Bash harness that exposed a race condition | **2** production blockers traced | Services, Data | none |
| 2 | BFI Finance | Backend intern, Jakarta, Dec 2025 – Jan 2026 | An event-driven Go service on NATS that caches WhatsApp customer media in object storage, extending retention from two weeks to indefinite; deployed with Docker and Kubernetes into the production loan workflow | **6,000** loan officers use that workflow daily | Services | none |
| 3 | PhysioActive Indonesia | Full-stack intern, Jakarta, Jul 2024 – Jan 2025 | Python ETL pipelines in BigQuery that classified 10,000+ customer messages with an LLM, giving the CEO same-day results; a Flask dashboard of customer messages and metrics | **−77%** employee response time, measured with test messages before and after launch | Data, Product | none |
| 4 | SlackDB | VillageHacks at ASU, Apr 2026 | Text-to-SQL in Slack with guardrails for LLM-written SQL: risk-scored migrations, sandbox validation, rollback detection, and approver enforcement; Clive built the guardrails and the FastAPI backend | **AutoDB track winner**, shown as an award rather than a number | Data, Product | [Code](https://github.com/cliverafiq/SlackDB), [Demo](https://slackdb.vercel.app/) |
| 5 | Drift | StarkHacks at Purdue, Apr 2026 | A passive focus tracker; Clive wrote the ESP32 firmware in C++ and a two-way WebSerial protocol, learned during the hackathon | **48 hours** to build | Firmware, Hardware | [Code](https://github.com/cliverafiq/Drift) |
| 6 | Assistive wearable | ASU, Aug – Nov 2025 | A smartwatch alternative for visually impaired users that gives the time, temperature, and compass direction through sound and touch | The existing photo, `public/projects/assistive-wearable.jpg`, with its current alt text | Hardware | none |
| 7 | SEDS Rocketry Division at ASU | Firmware engineer, Aug 2026 – now | Role only, until Clive sends a line | none | Firmware | none |

4. **Also:** one line each, with no layer lighting (all layers lit, none dimmed):
   - MRI denoising research, Aug – Dec 2025: PSNR up about 11 dB across about 3,000 MRI slices. [Code](https://github.com/cliverafiq/mri-tumor-segmentation)
   - k-Chinese Postman routing research, Dec 2023 – Nov 2024: route cost down by up to 22%. [Code](https://github.com/cliverafiq/postman)
   - TechTrek Indonesia, co-founder, Aug 2023 – Feb 2025: Python and VEX Robotics workshops for 30 students.
5. **Contact:** "Let's talk," with Email, LinkedIn, GitHub, and Resume. Every layer lights up, and the stack closes back into a solid block.

- **Cut:** the skills section (its tech now sits on the layers and in each entry) and the ASU entry (it moves into the opening line).
- **Left out by default:** the World Salon WebSocket and Terraform work, because the October 28 resume dropped it. It comes back only if Clive asks.
- **Resume:** `public/Rafiq_Clive_Resume.pdf` is replaced with the October 28 version.

The page should be about six laptop screens long, down from about nine.

## Visual system

| Token | Value | Used for |
| --- | --- | --- |
| Page | #ECEAE4 | Background |
| Ink | #121212 | Headings and body text |
| Muted | #55534D | Roles, dates, secondary text |
| Hairline | #CFCBC2 | Dividers |
| Layer colors | see the concept table | The stack, layer tags, the phone layer bar |

- **Type:** all three fonts are served from the site through Fontsource packages.

  | Font | Weights | Used for |
  | --- | --- | --- |
  | Bricolage Grotesque | 500, 800 | Name, headline, entry names, highlights |
  | Geist | 400, 500 | Body text |
  | Geist Mono | 500 | Tech names on the layers and on tags |

  Numbers use even widths.
- **The stack:** each layer is a rounded plate with:
  - visible thickness, as a darker side edge;
  - a soft shadow on the layer below;
  - its name and tech printed on top.

  Thin vertical traces connect the layers, like circuit traces. The view is tilted about 58° on one axis and −38° on the other, as in the prototype.
- **Entries:**
  - The name is in Bricolage Grotesque.
  - Role, place, and dates are muted.
  - The text runs one or two sentences.
  - The highlight is large.
  - Layer tags are small pills in each layer's color, always spelled out as words.
- **Principles carried over from version 1:** text lines under 70 characters, light theme only, and no arrows on links.
- **Dropped from version 1:** the bans on monospace labels and on shadows. The new design uses Geist Mono for tech names and shadows on the stack on purpose.

## Behavior and motion

- **On load:** the solid block splits into five layers in about one second, with a slight stagger.
- **While scrolling:**
  - The active entry is whichever one crosses the vertical middle of the window. Its layers lift about 20 px and brighten. The others dim to about 30% opacity and lose saturation. Transitions take about 300 ms.
  - When the lit layers change, a short pulse runs along the traces.
  - On the opening screen and in the Also list, nothing is dimmed.
- **Cursor tilt:** on devices with a fine pointer, the stack tilts up to about 4° toward the cursor.
- **Layer links:** each layer is a link to the first entry on that layer. Clicking it scrolls there.
- **At the end:** in Contact, every layer lights and the stack closes back into a solid block.

## Phones, reduced motion, no JavaScript, and accessibility

- **Phones (below 900 px wide):**
  - One column.
  - On the opening screen, a smaller stack sits under the headline and splits apart on load.
  - Past the opening screen, a slim layer bar pins under the top bar. It has five segments in the layer colors, with the active entry's layers lit and named in text (for example "Services + Data"). Tapping a segment jumps to that layer.
  - No cursor tilt.
- **Reduced motion:** the stack starts split apart. Highlights change instantly, with no lift, pulse, tilt, or closing.
- **Without JavaScript:** the stack shows split apart with every layer lit, all content is visible, and the layer links work because they are plain anchors.
- **Accessibility:**
  - Each layer is a focusable link named after its layer, with a visible focus ring.
  - Highlight changes are not announced, because each entry's tags already say the same thing in text.
  - All text meets WCAG AA, including text on every layer color and tag.
  - Linked entries clear the top bar (and the phone layer bar) when jumped to.

## Architecture

Static Astro site with TypeScript and plain CSS, deployed to GitHub Pages by the existing workflow on every push to `main`.

- **Kept:**
  - `src/layouts/Base.astro`, with its fonts swapped;
  - `src/data/site.ts`;
  - `src/lib/contrast.ts`;
  - `scripts/make-og.mjs`, redrawn to show the name, headline, and stack;
  - `scripts/build-preview.mjs` and `scripts/lib/inline-assets.mjs`;
  - `.github/workflows/deploy.yml`;
  - the Vitest setup and `tests/helpers/render.ts`.
- **Content:**
  - `src/data/layers.ts` holds the five layers in stack order: id, name, colors, and tech.
  - `src/data/work.ts` holds the seven entries in page order (name, role, place, dates, text, highlight, layer ids, links, optional image) and the Also list.
  - `src/data/profile.ts` gets the new headline and opening line.
  - `src/data/types.ts` is rewritten for these.

  Adding an entry means adding it to `work.ts`. The stack, tags, layer links, and phone bar all read from these files.
- **Components:**
  - `TopBar`, `Hero`, `Stack`, `WorkEntry`, `AlsoList`, `Contact`, and `LayerBar` (phones);
  - `src/pages/index.astro` assembles them.
- **Script:** `src/scripts/stack.ts` handles:
  - the load split;
  - tracking the active entry with an IntersectionObserver;
  - lighting layers and running the pulse;
  - cursor tilt, the closing at Contact, and the phone bar.

  It does nothing when reduced motion is on. The pure logic (which entry is active, which layers light) lives in `src/lib/stack-state.ts` so it can be unit-tested.
- **Styles:**
  - `src/styles/tokens.ts` holds the new palette and layer colors.
  - `src/styles/global.css` is rewritten.
  - The stack uses CSS 3D transforms on HTML elements, with no 3D or animation library.
- **Removed:**
  - **Components:** `WorldRoute`, `RouteSpine`, `MiniRoute`, `NextStop`, `SkillsFilter`, `Projects`, `ProjectRow`, `About`.
  - **Scripts and code:** `route-progress.ts`, `skills-filter.ts`, `geo.ts`, `route-math.ts`.
  - **Data:** `stops.ts`, `projects.ts`, `skills.ts`.
  - **Tests:** the ones for the removed parts.
  - **Packages:** `d3-geo`, `topojson-client`, `world-atlas`, their type packages, and `@fontsource/overpass`.
- **Assets:**
  - the October 28 resume PDF;
  - the wearable photo;
  - a new link-preview image;
  - a new tab icon shaped like a small stack.
- **README:** "Add a stop" becomes "Add an entry."

## Quality checks

Nothing goes live until every box below is ticked.

**Automated, and run on every deploy:**

- [ ] Every entry has at least one layer, and every layer has at least one entry.
- [ ] Every layer's text color, and every tag, meets WCAG AA on its background. Ink and muted meet it on the page.
- [ ] The active-entry and lit-layer logic picks the right entry at the top, the middle, and the end of the page.
- [ ] Components render their content from the data files.
- [ ] In the built site:
  - nothing starts hidden outside the load animation;
  - reduced motion switches animation off;
  - linked entries clear the top bar;
  - the assets ship;
  - axe finds no violations.

**By hand, before merging to `main`:**

- [ ] Screenshots at 375 px and 1280 px wide, at the opening screen, mid-page, and Contact.
- [ ] Lighthouse on mobile scores 95 or higher for performance, accessibility, best practices, and SEO.
- [ ] Keyboard-only navigation reaches every link, including the layers, with a visible focus ring.
- [ ] The page works with reduced motion on and with JavaScript off.
- [ ] Every link resolves, including the resume PDF and the repos.
- [ ] Link previews on LinkedIn and Slack show the new image.

## Open items and out of scope

- **SEDS Rocketry:** shows the role alone until Clive sends a one-line description.
- **Project images:** only the wearable has one. Screenshots of SlackDB and Drift can be added later without changing the design.
- **PhysioActive end date:** January 2025, as on the resume.

Out of scope: a dark theme, a Three.js or WebGL version, case-study pages or a blog, a contact form, analytics, and a custom domain.

Sources: Clive's resume of October 28, 2026; the current site data (`src/data/*.ts` at commit 49c1fbc); and Clive's answers in the October 28–29 design session.
