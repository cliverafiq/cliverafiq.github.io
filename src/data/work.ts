import type { AlsoItem, LayerId, WorkEntry } from './types';

export const work: WorkEntry[] = [
  { slug: 'world-salon', name: 'World Salon', role: 'Backend developer intern, New York', dates: 'May – Aug 2026',
    text: 'Traced two production-blocking failures: an ASGI adapter that failed every request under Python 3.12, and JWKS auth fetches breaking across containers. Shipped per-recipient read and unread tracking on FastAPI, Lambda, and DynamoDB, and built a Bash harness that exposed a race condition.',
    highlight: { value: '2', label: 'production blockers traced' }, layers: ['services', 'data'], links: [] },
  { slug: 'bfi-finance', name: 'BFI Finance', role: 'Backend intern, Jakarta', dates: 'Dec 2025 – Jan 2026',
    text: 'Built an event-driven Go service on NATS that caches WhatsApp customer media in object storage, extending retention from two weeks to indefinite. Deployed it with Docker and Kubernetes into the production loan workflow.',
    highlight: { value: '6,000', label: 'loan officers use that workflow daily' }, layers: ['services'], links: [] },
  { slug: 'physioactive', name: 'PhysioActive Indonesia', role: 'Full-stack intern, Jakarta', dates: 'Jul 2024 – Jan 2025',
    text: 'Built Python ETL pipelines in BigQuery that classified 10,000+ customer messages with an LLM, giving the CEO same-day results. Launched a Flask dashboard of customer messages and metrics.',
    highlight: { value: '−77%', label: 'employee response time, measured with test messages before and after launch' }, layers: ['data', 'product'], links: [] },
  { slug: 'slackdb', name: 'SlackDB', role: 'VillageHacks at ASU', dates: 'Apr 2026',
    text: 'Text-to-SQL in Slack, with guardrails for LLM-written SQL: risk-scored migrations, sandbox validation, rollback detection, and approver enforcement. I built the guardrails and the FastAPI backend.',
    award: 'AutoDB track winner', layers: ['data', 'product'],
    links: [{ label: 'Code', href: 'https://github.com/cliverafiq/SlackDB' }, { label: 'Demo', href: 'https://slackdb.vercel.app/' }] },
  { slug: 'drift', name: 'Drift', role: 'StarkHacks at Purdue', dates: 'Apr 2026',
    text: 'A passive focus tracker. I wrote the ESP32 firmware in C++ and a two-way WebSerial protocol, learning both during the hackathon.',
    highlight: { value: '48 hours', label: 'to build' }, layers: ['firmware', 'hardware'],
    links: [{ label: 'Code', href: 'https://github.com/cliverafiq/Drift' }] },
  { slug: 'assistive-wearable', name: 'Assistive wearable', role: 'ASU', dates: 'Aug – Nov 2025',
    text: 'A smartwatch alternative for visually impaired users that gives the time, temperature, and compass direction through sound and touch.',
    image: { src: '/projects/assistive-wearable.jpg', alt: 'The assistive wearable on a wrist, with its buttons, speaker, vibration output, Velcro straps, and battery pack labeled', width: 394, height: 324 },
    layers: ['hardware'], links: [] },
  { slug: 'seds-rocketry', name: 'SEDS Rocketry Division at ASU', role: 'Firmware engineer', dates: 'Aug 2026 – now', layers: ['firmware'], links: [] },
];

export const also: AlsoItem[] = [
  { name: 'MRI denoising research', dates: 'Aug – Dec 2025', line: 'PSNR up about 11 dB across about 3,000 MRI slices', link: { label: 'Code', href: 'https://github.com/cliverafiq/mri-tumor-segmentation' } },
  { name: 'k-Chinese Postman routing research', dates: 'Dec 2023 – Nov 2024', line: 'Route cost down by up to 22%', link: { label: 'Code', href: 'https://github.com/cliverafiq/postman' } },
  { name: 'TechTrek Indonesia', dates: 'Aug 2023 – Feb 2025', line: 'Co-founder; Python and VEX Robotics workshops for 30 students' },
];

/** The first entry on a layer, in page order. The layer's link goes here. */
export function firstEntryOn(layer: LayerId): WorkEntry {
  const entry = work.find(w => w.layers.includes(layer));
  if (!entry) throw new Error(`No entry on layer: ${layer}`);
  return entry;
}
