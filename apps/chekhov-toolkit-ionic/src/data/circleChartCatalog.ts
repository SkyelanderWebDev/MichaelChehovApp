export type ChartFamilyId =
  | 'psycho-physical'
  | 'emotional-life'
  | 'esthetics'
  | 'characterization'
  | 'transformation';

export interface ChartFamily {
  id: ChartFamilyId;
  label: string;
  color: string;
}

export interface ChartCategory {
  id: string;
  name: string;
  description?: string;
  family: ChartFamilyId;
  toolCount: number;
}

// Family order mirrors the chart numbering: 1–3 PsychoPhysical, 4–6 Characterization,
// 7–10 Emotional Life, 11–13 Esthetics, 14–16 Transformation (2026-07-02 sprint).
export const CHART_FAMILIES: ChartFamily[] = [
  { id: 'psycho-physical', label: 'PsychoPhysical Exercises', color: '#8b5cf6' },
  { id: 'characterization', label: 'Characterization', color: '#2563eb' },
  { id: 'emotional-life', label: 'Emotional Life', color: '#d97706' },
  { id: 'esthetics', label: 'Esthetics', color: '#0f766e' },
  { id: 'transformation', label: 'Transformation', color: '#be123c' },
];

// Category names and descriptions copied from client/src/lib/toolData.ts.
// Keep these aligned with the NMCA/Chekhov taxonomy source; do not casually rename.
// Order defines the 1–16 chart numbering; families must stay contiguous.
export const CHART_CATEGORIES: ChartCategory[] = [
  { id: 'expanding-contracting', name: 'Expanding & Contracting', description: 'PsychoPhysical Exercises', family: 'psycho-physical', toolCount: 2 },
  { id: 'qualities-of-movement', name: 'Qualities of Movement', description: 'The degree of resistance the movement meets', family: 'psycho-physical', toolCount: 7 },
  { id: 'archetypal-gestures', name: 'Archetypal Gestures', description: 'Pure will: Movement + Intent = Gesture', family: 'psycho-physical', toolCount: 10 },
  { id: 'movable-centers', name: 'Movable Centers', description: 'A psycho-physical focal point whose Location, Quality, and Mobility shape the entire character\'s way of being', family: 'characterization', toolCount: 3 },
  { id: 'imaginary-body', name: 'Imaginary Body', description: 'Step into any body you can imagine. Draw a Body Part scope, then a Substance, Form, or Kingdom. Archetypal Characters are always full body.', family: 'characterization', toolCount: 7 },
  { id: 'trinity-of-psychology', name: 'Trinity of Psychology', description: 'The three faculties of the human soul: Thinking, Feeling, and Willing', family: 'characterization', toolCount: 3 },
  { id: 'three-sisters', name: 'Three Sister Sensations of Equilibrium', description: 'How the body\'s felt relationship with gravity lives inside our emotions and language', family: 'emotional-life', toolCount: 3 },
  { id: 'qualities-sensations', name: 'Qualities & Sensations', description: 'Move with a Quality to awaken a Sensation that may lead to a Feeling: the body as doorway into emotional life', family: 'emotional-life', toolCount: 9 },
  { id: 'atmosphere', name: 'Atmosphere', description: 'Place + Event = Overall Atmosphere. Only one OA exists at any given moment, baptize it to awaken shared sensation in the ensemble. The fish is the PA; the water is the OA. A Personal Atmosphere is the \'air\' or \'essence\' a character carries through any world they inhabit', family: 'emotional-life', toolCount: 9 },
  { id: 'four-brothers', name: 'Four Brothers of Art', description: 'BEEF: Beauty, Ease, Entirety, and Form', family: 'emotional-life', toolCount: 4 },
  { id: 'ensemble', name: 'Ensemble', description: 'The art of group creation: listening, yielding, leading, and playing as one organism', family: 'esthetics', toolCount: 6 },
  { id: 'truth', name: 'Truth', description: 'The Diamond of Truth: nine interlocking facets of theatrical reality an actor must honor simultaneously', family: 'esthetics', toolCount: 7 },
  { id: 'style', name: 'Style', description: 'The esthetic form the work inhabits: genre, period, physicality, and mannerism', family: 'esthetics', toolCount: 4 },
  { id: 'tempo-rhythm', name: 'Tempo / Rhythm', description: 'Rhythmic and temporal patterns', family: 'transformation', toolCount: 5 },
  { id: 'focal-points', name: 'Focal Points of Concentration', description: 'Where attention lives determines what is real', family: 'transformation', toolCount: 5 },
  { id: 'psychological-gesture', name: 'Psychological Gesture', description: 'Psychological Gesture = Archetypal Gesture (Pure Will / what) + Feeling (how) + Thinking (why)', family: 'transformation', toolCount: 3 },
];

export function getFamily(familyId: ChartFamilyId): ChartFamily {
  return CHART_FAMILIES.find((family) => family.id === familyId) ?? CHART_FAMILIES[0];
}

export function getCategory(categoryId: string): ChartCategory | undefined {
  return CHART_CATEGORIES.find((category) => category.id === categoryId);
}

/**
 * Angle (degrees) for a chart node, CENTERED within its equal angular slot.
 *
 * `index * (360 / total)` lands a node on a slot boundary, which put nodes on the
 * family-arc seams. The `+ 0.5` offset advances each node to the center of its
 * own slot so they read as deliberately placed inside the ring.
 */
export function getChartNodeAngle(index: number, total: number): number {
  if (total <= 0) return -90;
  return -90 + ((index + 0.5) * 360) / total;
}

/**
 * Outer-ring family arcs derived from the live category order, so the ring
 * always matches the numbered nodes (contiguous family runs, equal node slots).
 *
 * CSS conic-gradient angles already start at 12 o'clock and run clockwise —
 * the same frame as the node slots (getChartNodeAngle offsets from the -90°
 * math angle, i.e. the top). So the gradient starts `from 0deg`; a -90deg
 * start would rotate every slice a quarter turn away from its numbered nodes.
 */
export function getFamilyArcGradient(alpha = 0.2): string {
  const total = CHART_CATEGORIES.length;
  if (total === 0) return 'none';

  const stops: string[] = [];
  let startIndex = 0;

  while (startIndex < total) {
    const family = CHART_CATEGORIES[startIndex].family;
    let endIndex = startIndex;
    while (endIndex + 1 < total && CHART_CATEGORIES[endIndex + 1].family === family) {
      endIndex += 1;
    }

    const fromDeg = (startIndex * 360) / total;
    const toDeg = ((endIndex + 1) * 360) / total;
    stops.push(`${hexToRgba(getFamily(family).color, alpha)} ${fromDeg}deg ${toDeg}deg`);
    startIndex = endIndex + 1;
  }

  return `conic-gradient(from 0deg, ${stops.join(', ')})`;
}

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Percent coordinates (0–100, relative to the square chart stage) for a node,
 * derived from the centered angle and a fixed orbit radius.
 */
export function getChartNodePosition(
  index: number,
  total: number,
  radius = 39,
): { angle: number; x: number; y: number } {
  const angle = getChartNodeAngle(index, total);
  const radians = (angle * Math.PI) / 180;
  return {
    angle,
    x: 50 + Math.cos(radians) * radius,
    y: 50 + Math.sin(radians) * radius,
  };
}
