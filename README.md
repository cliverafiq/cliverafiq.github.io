# cliverafiq.github.io

Clive Rafiq's portfolio: one page built around a route through the cities where the work happened, from Jakarta to New York. Static Astro site, deployed to GitHub Pages.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
```

Node 22.12 or newer.

## Test it

```bash
npm test           # unit and component tests
npm run test:site  # builds the site, then checks the built output
```

## Add a stop

1. Add the new id to `StopId` in `src/data/types.ts`.
2. Add the stop, with its years, main win, and entries, to `stops` in `src/data/stops.ts`, in journey order.
3. Point projects (`src/data/projects.ts`) and skills (`src/data/skills.ts`) at it where they belong.
4. Run `npm test`.

The top route, the route down the page, project rows, and every skill's mini route all read from these files.

## Update the link-preview image

```bash
npm run og         # writes public/og.png
```

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` runs the tests, builds the site, and publishes it to https://cliverafiq.github.io. In the repository settings, Pages must use GitHub Actions as its source.

## Design and plan

- Spec: `docs/superpowers/specs/2026-10-05-portfolio-design.md`
- Implementation plan: `docs/superpowers/plans/2026-10-05-portfolio.md`
