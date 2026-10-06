/** The spec's colors (six, plus two for the dark projects band). Defined once; Base.astro sets them on <html>. */
export const tokens = {
  page: '#F6F7F9',
  ink: '#0F1B2A',
  muted: '#5B6B7E',
  hairline: '#DDE2E8',
  track: '#C9D1DB',
  route: '#1F4FD8',
  routeOnDark: '#7C9BFF',
  mutedOnDark: '#A7B3C3',
} as const;

export const tokenStyle = Object.entries(tokens)
  .map(([name, value]) => `--${name}:${value}`)
  .join(';');
