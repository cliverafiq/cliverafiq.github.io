import type { Stop, StopId } from './types';

/** The route, in journey order. Entries follow the spec's "Experience entries" table. */
export const stops: Stop[] = [
  {
    id: 'jakarta',
    city: 'Jakarta',
    lat: -6.2,
    lon: 106.8,
    years: '2023–2026',
    win: 'Go services behind a 6,000-officer loan workflow',
    entries: [
      {
        org: 'BFI Finance',
        role: 'Backend intern, Dec 2025 – Jan 2026',
        points: [
          'Shipped Go microservices on Docker and Kubernetes into a production loan workflow used daily by 6,000 loan officers serving about 400K customers',
          'Built a Go media-caching service for WhatsApp customer documents, extending retention from two weeks to indefinite',
          'Wired up event-driven processing with NATS, object storage, and internal APIs',
        ],
      },
      {
        org: 'PhysioActive Indonesia',
        role: 'Full-stack intern, Jul 2024 – Jan 2025',
        points: [
          'Shipped a dashboard surfacing customer messages and performance metrics, cutting employee response time 77%',
          'Built Python ETL pipelines in BigQuery that use LLMs to classify 10,000+ messages for same-day sentiment analysis',
        ],
      },
      { org: 'TechTrek Indonesia', role: 'Co-founder, Aug 2023 – Feb 2025', line: 'Python and VEX Robotics workshops for 30 students' },
    ],
  },
  {
    id: 'tempe',
    city: 'Tempe',
    lat: 33.4,
    lon: -111.9,
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
    lat: 40.4,
    lon: -86.9,
    years: '2026',
    win: 'Drift, built in 48 hours',
    entries: [
      { org: 'Drift at StarkHacks, Purdue', role: 'Apr 2026', line: 'Focus tracker built in 48 hours' },
    ],
  },
  {
    id: 'new-york',
    city: 'New York',
    lat: 40.7,
    lon: -74.0,
    years: '2026',
    win: 'Real-time notifications on AWS',
    entries: [
      {
        org: 'World Salon',
        role: 'Backend developer intern, May – Aug 2026',
        points: [
          'Owned per-recipient read/unread tracking end to end on a serverless notification service (FastAPI, AWS Lambda, DynamoDB)',
          "Built real-time delivery on API Gateway WebSockets with Terraform, after finding that Socket.io's stateful connections couldn't run on Lambda",
          'Unblocked production twice by root-causing a Python 3.12 ASGI adapter failure and JWKS auth fetches breaking across containers',
          'Caught a race condition that marked in-flight notifications as successful, using a Bash harness later reused to verify idempotency',
        ],
      },
    ],
  },
];

export function stopById(id: StopId): Stop {
  const stop = stops.find(s => s.id === id);
  if (!stop) throw new Error(`Unknown stop: ${id}`);
  return stop;
}
