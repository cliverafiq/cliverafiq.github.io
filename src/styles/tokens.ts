/** The page tokens. Defined once; Base.astro sets them on <html>. The theme is light only. */
export const tokens = {
  page: '#ECEAE4',
  ink: '#121212',
  muted: '#55534D',
  hairline: '#CFCBC2',
} as const;

export const tokenStyle = Object.entries(tokens)
  .map(([name, value]) => `--${name}:${value}`)
  .join(';');
