import { layers } from '../data/layers';
import { PROBE_RATIO, stackView, tiltFor } from '../lib/stack-state';

export function initStack(
  win: Window = window,
  schedule: (update: () => void) => void = u => win.requestAnimationFrame(u),
): () => void {
  const doc = win.document;
  const stack = doc.querySelector<HTMLElement>('[data-stack]');
  const bar = doc.querySelector<HTMLElement>('[data-layer-bar]');
  const label = doc.querySelector<HTMLElement>('[data-layer-label]');
  const hero = doc.querySelector<HTMLElement>('[data-hero]');
  const also = doc.querySelector<HTMLElement>('[data-also]');
  const contact = doc.querySelector<HTMLElement>('[data-contact]');
  const entries = [...doc.querySelectorAll<HTMLElement>('[data-entry]')];
  if (!stack) return () => {};

  const query = (q: string) => win.matchMedia?.(q).matches ?? false;
  const reduced = query('(prefers-reduced-motion: reduce)');
  const fine = query('(pointer: fine)');

  const top = (el: Element | null) => (el ? el.getBoundingClientRect().top + win.scrollY : Infinity);
  const light = (root: HTMLElement | null, lit: Set<string>) => {
    if (!root) return;
    root.toggleAttribute('data-lit', lit.size > 0);
    root.querySelectorAll<HTMLElement>('[data-layer]').forEach(a => {
      a.toggleAttribute('data-on', lit.has(a.getAttribute('data-layer') ?? ''));
    });
  };

  let previous: string | null = null;
  let pulse = false;
  const update = () => {
    const probe = win.scrollY + win.innerHeight * PROBE_RATIO;
    const view = stackView(
      { entryTops: entries.map(top), entriesEnd: top(also), contactTop: top(contact) },
      probe,
    );
    // Measured with the rest, before any attribute write, so layout is read once.
    const heroGone = hero ? hero.getBoundingClientRect().bottom < 0 : false;
    const lit = new Set(
      view.active >= 0 ? (entries[view.active].getAttribute('data-layers') ?? '').split(/\s+/).filter(Boolean) : [],
    );
    const ordered = layers.filter(l => lit.has(l.id));
    const key = ordered.map(l => l.id).join(',');

    light(stack, lit);
    light(bar, lit);
    if (label) label.textContent = ordered.length ? ordered.map(l => l.name).join(' + ') : 'All layers';
    stack.toggleAttribute('data-closed', !reduced && view.closed);
    if (!reduced && previous !== null && key !== previous) {
      pulse = !pulse;
      stack.setAttribute('data-pulse', pulse ? 'a' : 'b');
    }
    previous = key;
    if (bar && hero) bar.toggleAttribute('data-show', heroGone);
  };

  let pending = false;
  let disposed = false;
  const onChange = () => {
    if (disposed || pending) return;
    pending = true;
    schedule(() => {
      pending = false;
      if (disposed) return;
      update();
    });
  };
  const onPointer = (e: PointerEvent | MouseEvent) => {
    const { rx, rz } = tiltFor(e.clientX, e.clientY, win.innerWidth, win.innerHeight);
    stack.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    stack.style.setProperty('--rz', `${rz.toFixed(2)}deg`);
  };

  update();
  win.addEventListener('scroll', onChange, { passive: true });
  win.addEventListener('resize', onChange);
  win.addEventListener('load', onChange);
  win.document.fonts?.ready.then(onChange);
  const tilt = fine && !reduced;
  if (tilt) win.addEventListener('pointermove', onPointer as EventListener);
  return () => {
    disposed = true;
    win.removeEventListener('scroll', onChange);
    win.removeEventListener('resize', onChange);
    win.removeEventListener('load', onChange);
    win.removeEventListener('pointermove', onPointer as EventListener);
  };
}
