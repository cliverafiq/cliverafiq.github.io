export type LayerId = 'hardware' | 'firmware' | 'services' | 'data' | 'product';

export interface Layer {
  id: LayerId;
  name: string;
  color: string;
  text: string;
  tech: string[];
}

export interface Link {
  label: 'Code' | 'Demo';
  href: string;
}

export interface Highlight {
  value: string;
  label: string;
}

export interface WorkImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface WorkEntry {
  slug: string; // anchor id is `entry-${slug}`
  name: string;
  role: string; // role and place, e.g. 'Backend developer intern, New York'
  dates: string;
  text?: string; // absent for SEDS (role only)
  highlight?: Highlight; // at most one of highlight, award, image
  award?: string;
  image?: WorkImage;
  layers: LayerId[]; // at least one
  links: Link[];
}

export interface AlsoItem {
  name: string;
  dates: string;
  line: string;
  link?: Link;
}

export interface Profile {
  name: string;
  headline: string;
  line: string;
  email: string;
  linkedin: string;
  github: string;
  resumePath: string;
}
