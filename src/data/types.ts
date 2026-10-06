export type StopId = 'jakarta' | 'tempe' | 'west-lafayette' | 'new-york';

/** One line of work at a stop. `role` is the spec's "Role and dates" cell. */
export interface Entry {
  org: string;
  role: string;
  line: string;
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
  figure: { value: string; label: string };
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
