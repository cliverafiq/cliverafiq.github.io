import type { Project } from './types';

/** From the spec's "Projects" table, in its order. */
export const projects: Project[] = [
  {
    slug: 'slackdb',
    name: 'SlackDB',
    stop: 'tempe',
    date: 'Apr 2026',
    summary: 'Text-to-SQL in Slack, with approvals before anything touches production',
    part: 'SQL guardrails (risk-scored migrations, sandbox validation, approver enforcement) and the FastAPI backend',
    stack: ['FastAPI', 'Slack Bolt', 'PostgreSQL', 'Docker'],
    result: 'AutoDB track winner at VillageHacks',
    links: [
      { label: 'Code', href: 'https://github.com/cliverafiq/SlackDB' },
      { label: 'Demo', href: 'https://slackdb.vercel.app/' },
    ],
  },
  {
    slug: 'drift',
    name: 'Drift',
    stop: 'west-lafayette',
    date: 'Apr 2026',
    summary: 'A passive focus tracker that fuses typing, gaze, and ambient light and noise into focus and fatigue scores',
    part: 'Bidirectional WebSerial protocol and ESP32 firmware in C++, learned during the hackathon',
    stack: ['React', 'MediaPipe', 'WebSerial', 'ESP32', 'C++'],
    result: 'Built in 48 hours at StarkHacks',
    links: [{ label: 'Code', href: 'https://github.com/cliverafiq/Drift' }],
  },
  {
    slug: 'mri-denoising',
    name: 'MRI denoising',
    stop: 'tempe',
    date: 'Aug – Dec 2025',
    summary: 'Removing Rician noise from MRI slices before tumor segmentation',
    part: 'Adapted FFDNet for Rician noise; built the training and evaluation pipeline',
    stack: ['Python', 'PyTorch', 'FFDNet'],
    result: 'PSNR up about 11 dB; mean squared error from about 851 to 81',
    links: [{ label: 'Code', href: 'https://github.com/cliverafiq/mri-tumor-segmentation' }],
  },
];
