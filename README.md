# cliverafiq.github.io

Clive Rafiq's portfolio: one page built around a five-layer 3D stack, from chip to cloud, that stays pinned beside the work and lights up the layers each entry touches. Static Astro site, deployed to GitHub Pages.

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

## Add an entry

1. Add it to `work` in `src/data/work.ts`, in page order, with its layers.
2. If it introduces new tech, add that to its layer in `src/data/layers.ts`.
3. Run `npm test`.

## Update the link-preview image

```bash
npm run og         # writes public/og.png
```

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` runs the tests, builds the site, and publishes it to https://cliverafiq.github.io. In the repository settings, Pages must use GitHub Actions as its source.

## Design and plan

- Spec: `docs/superpowers/specs/2026-10-29-portfolio-redesign-design.md`
- Implementation plan: `docs/superpowers/plans/2026-10-29-portfolio-redesign.md`

Previous design (October 5):

- Spec: `docs/superpowers/specs/2026-10-05-portfolio-design.md`
- Implementation plan: `docs/superpowers/plans/2026-10-05-portfolio.md`
