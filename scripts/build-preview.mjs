// Writes preview/index.html: the built page as one self-contained file for review.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { inlineAssets } from './lib/inline-assets.mjs';

const html = inlineAssets(readFileSync('dist/index.html', 'utf8'), path => readFileSync(join('dist', path)));
mkdirSync('preview', { recursive: true });
writeFileSync('preview/index.html', html);
console.log(`preview/index.html: ${Math.round(Buffer.byteLength(html) / 1024)} KB`);
