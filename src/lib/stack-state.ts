/** Share of the window height where the reader's probe line sits; the entry crossing it is active. */
export const PROBE_RATIO = 0.5;

/** Page-coordinate positions of the stack's entries and its end markers. */
export interface StackMarks {
  entryTops: number[];
  entriesEnd: number;
  contactTop: number;
}

/** Active entry index (-1 when every layer is lit) and whether the stack has closed. */
export interface StackView {
  active: number;
  closed: boolean;
}

/** Which entry the probe line is on, and whether the probe has reached Contact. */
export function stackView(marks: StackMarks, probe: number): StackView {
  let active = -1;
  if (probe < marks.entriesEnd) {
    marks.entryTops.forEach((top, i) => {
      if (top <= probe) active = i;
    });
  }
  return { active, closed: probe >= marks.contactTop };
}

/** Clamps a value into [-max, max]. */
function clamp(value: number, max: number): number {
  return Math.min(max, Math.max(-max, value));
}

/** Tilt in degrees for a pointer at (x, y) in a box of the given size, capped at max. */
export function tiltFor(x: number, y: number, width: number, height: number, max = 4): { rx: number; rz: number } {
  return {
    rx: clamp((0.5 - y / height) * 2 * max, max),
    rz: clamp((x / width - 0.5) * 2 * max, max),
  };
}
