import { PROBE_RATIO, currentStopIndex, fillLength, visitedCount } from '../lib/route-math';

/**
 * Turns on scroll progress along the route. Without this script the route
 * shows complete; with it, the fill, visited dots, and the top-bar route
 * follow the reader. Returns a function that stops listening.
 */
export function initRouteProgress(
  win: Window = window,
  schedule: (update: () => void) => void = update => win.requestAnimationFrame(update),
): () => void {
  const doc = win.document;
  const spine = doc.querySelector<HTMLElement>('[data-spine]');
  if (!spine) return () => {};
  const dots = [...doc.querySelectorAll<HTMLElement>('[data-stop-dot]')];
  const links = [...doc.querySelectorAll<HTMLAnchorElement>('[data-topbar-route] a')];
  const mini = doc.querySelector<HTMLElement>('[data-topbar-route]');
  const cityLabel = doc.querySelector<HTMLElement>('[data-current-city]');
  const hero = doc.querySelector<HTMLElement>('[data-hero]');

  spine.setAttribute('data-progress', '');

  const update = () => {
    const y = win.scrollY;
    const probe = y + win.innerHeight * PROBE_RATIO;
    const box = spine.getBoundingClientRect();
    spine.style.setProperty('--fill', `${fillLength(probe, box.top + y, box.height)}px`);

    const tops = dots.map(dot => dot.getBoundingClientRect().top + y);
    const count = visitedCount(tops, probe);
    dots.forEach((dot, i) => dot.toggleAttribute('data-visited', i < count));

    const current = currentStopIndex(tops, probe);
    links.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (cityLabel) cityLabel.textContent = links[current]?.getAttribute('aria-label') ?? '';
    if (mini && hero) mini.toggleAttribute('data-show', hero.getBoundingClientRect().bottom < 0);
  };

  let pending = false;
  const onChange = () => {
    if (pending) return;
    pending = true;
    schedule(() => {
      pending = false;
      update();
    });
  };

  update();
  win.addEventListener('scroll', onChange, { passive: true });
  win.addEventListener('resize', onChange);
  // Web fonts and late layout move the stops after the first pass; measure again once they settle.
  win.addEventListener('load', onChange);
  win.document.fonts?.ready.then(onChange);
  return () => {
    win.removeEventListener('scroll', onChange);
    win.removeEventListener('resize', onChange);
    win.removeEventListener('load', onChange);
  };
}
