/**
 * Reveals the skill filter buttons and wires them up. Without this script
 * the buttons stay hidden and every skill shows.
 */
export function initSkillsFilter(root: Document = document): void {
  const group = root.querySelector<HTMLElement>('.filters');
  if (!group) return;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('button[data-filter]')];
  const rows = [...root.querySelectorAll<HTMLElement>('ul.skills > li[data-category]')];

  group.hidden = false;
  group.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    rows.forEach(row => {
      row.hidden = filter !== 'all' && row.dataset.category !== filter;
    });
  });
}
