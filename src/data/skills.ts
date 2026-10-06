import type { Skill, SkillCategory } from './types';

export const categoryLabels: Record<SkillCategory, string> = {
  languages: 'Languages',
  'backend-infra': 'Backend and infra',
  'data-ml': 'Data and ML',
  hardware: 'Hardware',
};

/** From the spec's "Skills and where they were used" table, in its order. */
export const skills: Skill[] = [
  { name: 'Python', category: 'languages', usedAt: ['jakarta', 'tempe', 'new-york'] },
  { name: 'Go', category: 'languages', usedAt: ['jakarta'] },
  { name: 'C++', category: 'languages', usedAt: ['west-lafayette'] },
  { name: 'SQL', category: 'languages', usedAt: ['jakarta', 'tempe'] },
  { name: 'Bash', category: 'languages', usedAt: ['new-york'] },
  { name: 'FastAPI', category: 'backend-infra', usedAt: ['tempe', 'new-york'] },
  { name: 'Docker', category: 'backend-infra', usedAt: ['jakarta', 'tempe'] },
  { name: 'Kubernetes', category: 'backend-infra', usedAt: ['jakarta'] },
  { name: 'NATS', category: 'backend-infra', usedAt: ['jakarta'] },
  { name: 'Terraform', category: 'backend-infra', usedAt: ['new-york'] },
  { name: 'AWS (Lambda, SQS, DynamoDB, API Gateway)', category: 'backend-infra', usedAt: ['new-york'] },
  { name: 'PostgreSQL', category: 'data-ml', usedAt: ['tempe'] },
  { name: 'BigQuery', category: 'data-ml', usedAt: ['jakarta'] },
  { name: 'PyTorch', category: 'data-ml', usedAt: ['tempe'] },
  { name: 'MediaPipe', category: 'data-ml', usedAt: ['west-lafayette'] },
  { name: 'ESP32', category: 'hardware', usedAt: ['west-lafayette'] },
  { name: 'WebSerial', category: 'hardware', usedAt: ['west-lafayette'] },
];
