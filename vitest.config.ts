/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

const site = Boolean(process.env.SITE_TESTS);

export default getViteConfig({
  test: {
    include: site ? ['tests/site/**/*.test.ts'] : ['tests/**/*.test.ts'],
    exclude: site ? ['node_modules/**'] : ['node_modules/**', 'tests/site/**'],
  },
});
