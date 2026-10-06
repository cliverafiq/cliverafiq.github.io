import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import landTopology from 'world-atlas/land-110m.json';

/** A Pacific-centred crop (60°E to 50°W, 68°N to 18°S), so the route reads left to right. */
export const MAP = { lon0: 60, lon1: 310, lat0: 68, lat1: -18, cols: 100, rows: 34, width: 1000, height: 357 } as const;

export interface Point {
  x: number;
  y: number;
}

/** Longitude and latitude to fractions (0–1) of the crop. */
export function project(lon: number, lat: number): Point {
  const east = lon < 0 ? lon + 360 : lon;
  return {
    x: (east - MAP.lon0) / (MAP.lon1 - MAP.lon0),
    y: (MAP.lat0 - lat) / (MAP.lat0 - MAP.lat1),
  };
}

/** Centres of the grid cells that fall on land, as fractions of the crop. Runs at build time. */
export function landDots(): Point[] {
  const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>;
  const land = feature(topology, topology.objects.land);
  const dots: Point[] = [];
  for (let row = 0; row < MAP.rows; row++) {
    for (let col = 0; col < MAP.cols; col++) {
      const x = (col + 0.5) / MAP.cols;
      const y = (row + 0.5) / MAP.rows;
      let lon = MAP.lon0 + x * (MAP.lon1 - MAP.lon0);
      if (lon > 180) lon -= 360;
      const lat = MAP.lat0 - y * (MAP.lat0 - MAP.lat1);
      if (geoContains(land, [lon, lat])) dots.push({ x, y });
    }
  }
  return dots;
}

const round = (n: number) => +n.toFixed(1);
const toView = (p: Point): [number, number] => [round(p.x * MAP.width), round(p.y * MAP.height)];

/** One path of zero-length segments; drawn with round caps, each becomes a dot. */
export function dotsPath(dots: Point[]): string {
  return dots.map(p => {
    const [x, y] = toView(p);
    return `M${x} ${y}h0`;
  }).join('');
}

/** The route as one path: a curve per hop, arching above the higher end by 35% of the hop. */
export function routePath(points: Point[]): string {
  const [first, ...rest] = points.map(toView);
  let d = `M${first[0]} ${first[1]}`;
  let prev = first;
  for (const p of rest) {
    const hop = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    d += ` Q${round((prev[0] + p[0]) / 2)} ${round(Math.min(prev[1], p[1]) - 0.35 * hop)} ${p[0]} ${p[1]}`;
    prev = p;
  }
  return d;
}

export function formatCoords(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(1)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lon).toFixed(1)}° ${lon < 0 ? 'W' : 'E'}`;
}
