// Folds a built page's /_astro/ stylesheets, module scripts, WOFF2 fonts, and local images
// into the HTML, so the page works as one self-contained file.
const FONT_URL = /url\((\/_astro\/[^)\s]+\.woff2)\)/g;
// Fontsource lists a WOFF fallback after each WOFF2 source; every browser that
// can open the preview reads WOFF2, so the fallback is dropped rather than inlined.
const IMAGE_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' };
const LOCAL_IMG = /(<img\b[^>]*?\ssrc=")(\/[^"]+\.(jpe?g|png|webp|svg))"/g;
const WOFF_FALLBACK = /,\s*url\(\/_astro\/[^)\s]+\.woff\)\s*format\(["']woff["']\)/g;

/**
 * @param {string} html
 * @param {(urlPath: string) => Buffer} readAsset
 * @returns {string}
 */
export function inlineAssets(html, readAsset) {
  const inlineFonts = css =>
    css.replace(WOFF_FALLBACK, '').replace(FONT_URL, (_, path) => `url(data:font/woff2;base64,${readAsset(path).toString('base64')})`);
  return html
    .replace(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"\s*\/?>/g,
      (_, path) => `<style>${inlineFonts(readAsset(path).toString('utf8'))}</style>`)
    .replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_, attrs, css) => `<style${attrs}>${inlineFonts(css)}</style>`)
    .replace(/<script type="module" src="(\/_astro\/[^"]+\.js)"><\/script>/g,
      (_, path) => `<script type="module">${readAsset(path).toString('utf8')}</script>`)
    .replace(LOCAL_IMG, (_, head, path, ext) =>
      `${head}data:${IMAGE_TYPES[ext.toLowerCase()]};base64,${readAsset(path).toString('base64')}"`);
}
