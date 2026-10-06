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
    (path: string) => files[path],
  );
  expect(out).toContain('<style>@font-face{src:url(data:font/woff2;base64,AAEC) format("woff2")}body{color:red}</style>');
  expect(out).toContain('<script type="module">console.log(1)</script>');
  expect(out).not.toContain('/_astro/');
  expect(out).toContain('href="/Rafiq_Clive_Resume.pdf"');
});

test('drops WOFF fallbacks, which no current browser needs once WOFF2 is inline', () => {
  const css = '@font-face{src:url(/_astro/f.woff2)format("woff2"),url(/_astro/f.woff)format("woff")}';
  const out = inlineAssets('<link rel="stylesheet" href="/_astro/a.css">', (path: string) => (path === '/_astro/a.css' ? Buffer.from(css) : Buffer.from([0, 1, 2])));
  expect(out).toBe('<style>@font-face{src:url(data:font/woff2;base64,AAEC)format("woff2")}</style>');
});

test('inlines local images, such as project photos, as data URIs', () => {
  const out = inlineAssets('<img src="/projects/a.jpg" alt="a"><a href="/Rafiq_Clive_Resume.pdf">r</a>', (path: string) => (path === '/projects/a.jpg' ? Buffer.from([0, 1, 2]) : Buffer.from('')));
  expect(out).toBe('<img src="data:image/jpeg;base64,AAEC" alt="a"><a href="/Rafiq_Clive_Resume.pdf">r</a>');
});
