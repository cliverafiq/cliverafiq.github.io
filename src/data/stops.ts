import type { Stop, StopId } from './types';

/** The route, in journey order. Entries follow the spec's "Experience entries" table. */
export const stops: Stop[] = [
  {
    id: 'jakarta',
    city: 'Jakarta',
    years: '2023–2026',
    win: 'Go services behind a 6,000-officer loan workflow',
    entries: [
      { org: 'BFI Finance', role: 'Backend intern, Dec 2025 – Jan 2026', line: 'Go microservices in a production loan workflow used daily by 6,000 loan officers serving about 400K customers' },
      { org: 'PhysioActive Indonesia', role: 'Full-stack intern, Jul 2024 – Jan 2025', line: 'Dashboard that cut employee response time 77%' },
      { org: 'TechTrek Indonesia', role: 'Co-founder, Aug 2023 – Feb 2025', line: 'Python and VEX Robotics workshops for 30 students' },
    ],
  },
  {
    id: 'tempe',
    city: 'Tempe',
    years: '2025–now',
    win: 'AutoDB track win at VillageHacks',
    entries: [
      { org: 'Arizona State University', role: 'B.S.E. Computer Systems Engineering, Aug 2025 – May 2028', line: 'Graduating a year early' },
      { org: 'SlackDB at VillageHacks', role: 'Apr 2026', line: 'AutoDB track winner' },
      { org: 'MRI denoising research', role: 'Aug – Dec 2025', line: 'PSNR up about 11 dB across about 3,000 MRI slices' },
    ],
  },
  {
    id: 'west-lafayette',
    city: 'West Lafayette',
    years: '2026',
    win: 'Drift, built in 48 hours',
    entries: [
      { org: 'Drift at StarkHacks, Purdue', role: 'Apr 2026', line: 'Focus tracker built in 48 hours' },
    ],
  },
  {
    id: 'new-york',
    city: 'New York',
    years: '2026',
    win: 'Real-time notifications on AWS',
    entries: [
      { org: 'World Salon', role: 'Backend developer intern, May – Aug 2026', line: 'Real-time notifications on API Gateway WebSockets; unblocked production twice' },
    ],
  },
];

export function stopById(id: StopId): Stop {
  const stop = stops.find(s => s.id === id);
  if (!stop) throw new Error(`Unknown stop: ${id}`);
  return stop;
}
