export type StopId = 'jakarta' | 'tempe' | 'west-lafayette' | 'new-york';

/**
 * One entry at a stop. `role` is the spec's "Role and dates" cell.
 * Internships carry their resume bullets as `points`; most other entries have a one-line `line`,
 * and an entry may show its role alone.
 */
export interface Entry {
  org: string;
  role: string;
  line?: string;
  points?: string[];
}

export interface Stop {
  id: StopId;
  city: string;
  lat: number;
  lon: number;
  years: string;
  win: string;
  entries: Entry[];
}

export interface ProjectLink {
  label: 'Code' | 'Demo';
  href: string;
}

export interface Project {
  slug: string;
  name: string;
  stop: StopId;
  date: string;
  summary: string;
  part: string;
  stack: string[];
  result: string;
  /** Each project leads with exactly one of these: a large figure, or a photo of the work. */
  figure?: { value: string; label: string };
  image?: { src: string; alt: string; width: number; height: number };
  links: ProjectLink[];
}

export type SkillCategory = 'languages' | 'backend-infra' | 'data-ml' | 'hardware';

export interface Skill {
  name: string;
  category: SkillCategory;
  usedAt: StopId[];
}

export interface Profile {
  name: string;
  headline: string;
  about: string[];
  email: string;
  linkedin: string;
  github: string;
  resumePath: string;
}
