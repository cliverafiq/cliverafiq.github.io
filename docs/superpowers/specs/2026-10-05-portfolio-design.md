# Clive Rafiq portfolio: design spec

Oct 5, 2026 · @Clive

## Goal and audience

The site exists to help win a 2027 software engineering internship. Within 30 seconds, a recruiter should know that Clive builds backend systems that run in production, and should open at least one project.

- **Audience:** recruiters and engineers screening for software internships (not embedded roles) in the 2027 cycle.
- **Main message:** backend systems in production. The hardware-software projects add range but are not the lead.
- **What people should remember:** what Clive has accomplished.
- **Inspiration:** [Aayush Pandey's portfolio](https://aayushp123.github.io/). Keep its structure: one page, projects shown with impact and links, numbers at a glance, and skill filters. Give it Clive's own look, because both are ASU students graduating in 2028, applying in the same cycle, with a shared project (SlackDB).

## Concept: the route

Clive's accomplishments sit along the cities where they happened, drawn like a transit line. The route is the one memorable element, and everything around it stays quiet.

| Stop | Years | Main win shown at the top |
| --- | --- | --- |
| Jakarta | 2023–2026 | Go services behind a 6,000-officer loan workflow |
| Tempe | 2025–now | AutoDB track win at VillageHacks |
| West Lafayette | 2026 | Drift, built in 48 hours |
| New York | 2026 | Real-time notifications on AWS |
| Next (dashed) | 2027 | Internship, which doubles as the contact section |

The route reads in journey order, so the newest work comes last in the experience section. The top route shows all four stops at once, so recruiters still see it right away.

## Page structure and content

One page in six parts, top to bottom. All wording below is draft until the copy pass.

1. **Top:** name, headline (draft: "Backend engineer. Shipping at every stop, from Jakarta to New York."), the four-stop route, and links to the resume and GitHub.
2. **About:** two or three sentences on Computer Systems Engineering at ASU, graduating a year early in May 2028, and an interest in where software meets hardware.
3. **Experience:** the route down the page, with entries in the order of the table below.
4. **Projects:** rows that hang off their stop, each showing what it is, Clive's part, the stack, one result, and links.
5. **Skills:** category filter buttons. Each skill shows a mini route marking the stops where it was used, so only skills with a stop appear.
6. **Contact:** the dashed last stop, "Next: 2027 internship," with email, LinkedIn, GitHub, and the resume PDF.

Experience entries, in page order:

| Stop | Entry | Role and dates | Line shown |
| --- | --- | --- | --- |
| Jakarta | BFI Finance | Backend intern, Dec 2025 – Jan 2026 | Go microservices in a production loan workflow used daily by 6,000 loan officers serving about 400K customers |
| Jakarta | PhysioActive Indonesia | Full-stack intern, Jul 2024 – Jan 2025 | Dashboard that cut employee response time 77% |
| Jakarta | TechTrek Indonesia | Co-founder, Aug 2023 – Feb 2025 | Python and VEX Robotics workshops for 30 students |
| Tempe | Arizona State University | B.S.E. Computer Systems Engineering, Aug 2025 – May 2028 | Graduating a year early |
| Tempe | SlackDB at VillageHacks | Apr 2026 | AutoDB track winner |
| Tempe | MRI denoising research | Aug – Dec 2025 | PSNR up about 11 dB across about 3,000 MRI slices |
| West Lafayette | Drift at StarkHacks, Purdue | Apr 2026 | Focus tracker built in 48 hours |
| New York | World Salon | Backend developer intern, May – Aug 2026 | Real-time notifications on API Gateway WebSockets; unblocked production twice |

Projects:

| Project | Stop and date | What it is | Clive's part | Stack | Result | Links |
| --- | --- | --- | --- | --- | --- | --- |
| SlackDB | Tempe, Apr 2026 | Text-to-SQL in Slack, with approvals before anything touches production | SQL guardrails (risk-scored migrations, sandbox validation, approver enforcement) and the FastAPI backend | FastAPI, Slack Bolt, PostgreSQL, Docker | AutoDB track winner at VillageHacks | [Code](https://github.com/cliverafiq/SlackDB), [demo](https://slackdb.vercel.app/) |
| Drift | West Lafayette, Apr 2026 | A passive focus tracker that fuses typing, gaze, and ambient light and noise into focus and fatigue scores | Bidirectional WebSerial protocol and ESP32 firmware in C++, learned during the hackathon | React, MediaPipe, WebSerial, ESP32, C++ | Built in 48 hours at StarkHacks | [Code](https://github.com/cliverafiq/Drift) |
| MRI denoising | Tempe, Aug – Dec 2025 | Removing Rician noise from MRI slices before tumor segmentation | Adapted FFDNet for Rician noise; built the training and evaluation pipeline | Python, PyTorch, FFDNet | PSNR up about 11 dB; mean squared error from about 851 to 81 | [Code](https://github.com/cliverafiq/mri-tumor-segmentation) |

Skills and where they were used:

| Skill | Category | Used at |
| --- | --- | --- |
| Python | Languages | Jakarta, Tempe, New York |
| Go | Languages | Jakarta |
| C++ | Languages | West Lafayette |
| SQL | Languages | Jakarta, Tempe |
| Bash | Languages | New York |
| FastAPI | Backend and infra | Tempe, New York |
| Docker | Backend and infra | Jakarta, Tempe |
| Kubernetes | Backend and infra | Jakarta |
| NATS | Backend and infra | Jakarta |
| Terraform | Backend and infra | New York |
| AWS (Lambda, SQS, DynamoDB, API Gateway) | Backend and infra | New York |
| PostgreSQL | Data and ML | Tempe |
| BigQuery | Data and ML | Jakarta |
| PyTorch | Data and ML | Tempe |
| MediaPipe | Data and ML | West Lafayette |
| ESP32 | Hardware | West Lafayette |
| WebSerial | Hardware | West Lafayette |

## Visual system

The look is light, quiet, and typographic, with cobalt reserved for the route and links.

| Token | Hex | Used for |
| --- | --- | --- |
| Page | #F6F7F9 | Background |
| Ink | #0F1B2A | Headings and body text |
| Muted | #5B6B7E | Secondary text, years, labels |
| Hairline | #DDE2E8 | Dividers between entries |
| Track | #C9D1DB | Unfilled route line and unused mini-route stops |
| Route | #1F4FD8 | The route, visited stops, links, focus rings |

- **Type:** Overpass only, served from the site, at weights 400 and 500, with even-width numbers for dates. Sizes are 14 for labels, 16 for secondary text, 18 for body, 24 for stop and project names, 36 for section headings, and 48 for the headline (32 on phones).
- **Layout:** one left-aligned column, at most about 1040 px wide, with text lines under 70 characters. The route runs along the left edge of the experience section.
- **Principles:**
  - The route is the one memorable element, and nothing else competes with it.
  - Every structural device carries information: dots are places, filled dots mark where something happened, and years say when.
  - No template patterns: no monospace labels, no "A · B · C" strings, no boxed card grids, no all-caps labels, no arrows on links, and no single accented word in a headline.
  - Light only. There is no dark version in version 1.

## Behavior and motion

There is one animated moment when the page loads. After that, motion only responds to scrolling, and all of it happens on the route.

- **On load:** the top route draws left to right in about 1 second, and the stops appear in order, on each page load.
- **While scrolling:**
  - The route down the page fills with cobalt up to the reader's position.
  - Each stop's dot turns solid when the reader reaches it.
  - After the top section, a small copy of the route sits in the top bar with the current city highlighted. Tapping a city jumps to it.
- **Reduced motion:** nothing animates. Fills and dots update instantly.
- **On phones:** the top route keeps only the dots and city names, and each stop's main win appears in the experience section instead. In project rows, the stop and date sit above the content.
- **Skills filter:** All is selected by default. Picking a category shows only its skills.
- **Without JavaScript:** the route shows fully drawn, every skill is visible, and all links work.
- **Links and focus:** each stop on the top route links to its part of the experience section. Keyboard focus shows as a cobalt ring.

## Architecture and deployment

> Diagram: content files (stops, projects, skills, public/) feed the Astro components, which make up index.astro; `astro build` produces the static site, and a GitHub Action deploys it to cliverafiq.github.io on every push to main. The drawn version is in the doc: https://claude.ai/code/artifact/d6f8df6c-ba4b-4d65-97b5-307c655367cc

Adding a city takes one new entry in stops.ts. The top route, the route down the page, the project rows, and every skill's mini route all read from it.

- **Stack:** Astro and TypeScript, with plain CSS built on the tokens above and no CSS framework.
- **Scripts:** one small script for the scroll fill, visited stops, and the top-bar route, and one for the skills filter.
- **Fonts:** Overpass through the @fontsource package, served from the site itself.
- **Assets:** the resume PDF, a route-shaped tab icon in SVG, and a 1200 × 630 link-preview image.
- **Deploy:** a GitHub Actions workflow using withastro/action publishes to GitHub Pages on every push to main.
- **Repo:** cliverafiq.github.io, with a README that explains how to add a stop.

## Quality checks

Nothing goes live until every box below is ticked.

- [ ] Every number and claim traces to the resume or to something Clive confirmed.
- [ ] Screenshots at 375 px and 1280 px wide match the approved sketches.
- [ ] Keyboard-only navigation reaches every link and filter, with a visible focus ring.
- [ ] Text contrast meets WCAG AA, and the route works with reduced motion turned on.
- [ ] Every link resolves, including the resume PDF and the project repos.
- [ ] Lighthouse on mobile scores 95 or higher for performance, accessibility, best practices, and SEO.
- [ ] Link previews on LinkedIn and Slack show the preview image.

During the build, previews are published here in Claude, so Clive can click through the site before anything goes to GitHub.

## Defaults to confirm and out of scope

These defaults apply unless Clive changes them.

- **SlackDB award wording:** "Winner, AutoDB track at VillageHacks," as on the resume. Aayush's site says "1st place at VillageHacks," and the two should match.
- **World Salon stop:** New York, the company's city, whether the internship was remote or on site.
- **Mimic Glove:** left out until the hardware ships, since the page is about finished work.
- **GitHub profile README:** it still lists World Salon as current. Fix it alongside the repo review, outside this site.
- **Address:** cliverafiq.github.io. A custom domain can come later.

Out of scope for version 1: a dark version, a blog or case-study pages, a contact form (email links instead), analytics, and a content management system.

Sources: Clive's resume (uploaded October 5, 2026), [github.com/cliverafiq](https://github.com/cliverafiq), and [aayushp123.github.io](https://aayushp123.github.io/).

## Revision 2: bolder visual design

Clive found version 1 too plain and chose the world-map hero on October 6, 2026. Where this section conflicts with the ones above, it wins.

- **Hero:** the route runs across a dotted world map, centered on the Pacific so it reads left to right: Jakarta, across the ocean to Tempe, West Lafayette, and New York, then a dashed segment to "Next: 2027." The dots are generated at build time from Natural Earth land data, and the arc draws itself on load using CSS only. City labels are HTML over the map so they stay readable on phones. The four main wins sit in a strip under the map.
- **Type:** headline 72 px (40 on phones), section headings 48 px, city names in the experience route 40 px.
- **Experience route:** an 8 px line and 28 px interchange-style stops. Each city shows its coordinates, for example "6.2° S, 106.8° E."
- **Projects:** a full-width dark band (ink background) to change the page's pace. Each row leads with one large result figure, since the repos have no images yet; screenshots from Clive can replace them.
- **Tokens:** two additions for the dark band, route on dark #7C9BFF and muted on dark #A7B3C3, both above 4.5:1 on ink.
- **Name:** shown once, in the top bar. The hero keeps it for screen readers.
