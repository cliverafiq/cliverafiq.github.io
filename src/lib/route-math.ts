/** Where on the screen the reader "is": 55% of the way down the viewport. */
export const PROBE_RATIO = 0.55;

export function fillLength(probeY: number, spineTop: number, spineHeight: number): number {
  return Math.min(Math.max(probeY - spineTop, 0), spineHeight);
}

export function visitedCount(stopTops: readonly number[], probeY: number): number {
  return stopTops.filter(top => top <= probeY).length;
}

export function currentStopIndex(stopTops: readonly number[], probeY: number): number {
  return Math.max(visitedCount(stopTops, probeY) - 1, 0);
}
