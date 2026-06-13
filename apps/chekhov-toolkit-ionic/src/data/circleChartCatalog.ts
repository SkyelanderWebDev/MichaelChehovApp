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

export const CHART_FAMILIES: ChartFamily[] = [
  { id: 'psycho-physical', label: 'PsychoPhysical', color: '#8b5cf6' },
  { id: 'emotional-life', label: 'Emotional Life', color: '#d97706' },
  { id: 'esthetics', label: 'Esthetics', color: '#0f766e' },
  { id: 'characterization', label: 'Characterization', color: '#2563eb' },
  { id: 'transformation', label: 'Transformation', color: '#be123c' },
];

// Category names and descriptions copied from client/src/lib/toolData.ts.
// Keep these aligned with the NMCA/Chekhov taxonomy source; do not casually rename.
export const CHART_CATEGORIES: ChartCategory[] = [
  { id: 'expanding-contracting', name: 'Expanding & Contracting', description: 'Core PsychoPhysical movement', family: 'psycho-physical', toolCount: 2 },
  { id: 'qualities-of-movement', name: 'Qualities of Movement', description: 'The degree of resistance the movement meets', family: 'psycho-physical', toolCount: 7 },
  { id: 'archetypal-gestures', name: 'Archetypal Gestures', description: 'Pure will — Movement + Intent = Gesture', family: 'psycho-physical', toolCount: 10 },
  { id: 'three-sisters', name: 'Three Sister Sensations of Equilibrium', description: 'How the body\'s felt relationship with gravity lives inside our emotions and language', family: 'emotional-life', toolCount: 3 },
  { id: 'qualities-sensations', name: 'Qualities & Sensations', description: 'Move with a Quality to awaken a Sensation that may lead to a Feeling — the body as doorway into emotional life', family: 'emotional-life', toolCount: 9 },
  { id: 'atmosphere', name: 'Atmosphere', description: 'Place + Event = Overall Atmosphere — only one OA exists at any given moment, baptize it to awaken shared sensation in the ensemble. The fish is the PA; the water is the OA. A Personal Atmosphere is the \'air\' or \'essence\' a character carries through any world they inhabit', family: 'emotional-life', toolCount: 9 },
  { id: 'four-brothers', name: 'Four Brothers of Art', description: 'BEEF: Beauty, Ease, Entirety, and Form', family: 'emotional-life', toolCount: 4 },
  { id: 'ensemble', name: 'Ensemble', description: 'The art of group creation — listening, yielding, leading, and playing as one organism', family: 'esthetics', toolCount: 6 },
  { id: 'truth', name: 'Truth', description: 'The Diamond of Truth — nine interlocking facets of theatrical reality an actor must honor simultaneously', family: 'esthetics', toolCount: 7 },
  { id: 'style', name: 'Style', description: 'The esthetic form the work inhabits — genre, period, physicality, and mannerism', family: 'esthetics', toolCount: 4 },
  { id: 'movable-centers', name: 'Movable Centers', description: 'A psycho-physical focal point whose Location, Quality, and Mobility shape the entire character\'s way of being', family: 'characterization', toolCount: 3 },
  { id: 'imaginary-body', name: 'Imaginary Body', description: 'Step into any body you can imagine — draw a Body Part scope, then a Substance, Form, or Kingdom. Archetypal Characters are always full body.', family: 'characterization', toolCount: 7 },
  { id: 'trinity-of-psychology', name: 'Trinity of Psychology', description: 'The three faculties of the human soul — Thinking, Feeling, and Willing', family: 'characterization', toolCount: 3 },
  { id: 'tempo-rhythm', name: 'Tempo / Rhythm', description: 'Rhythmic and temporal patterns', family: 'transformation', toolCount: 5 },
  { id: 'focal-points', name: 'Focal Points of Concentration', description: 'Where attention lives determines what is real', family: 'transformation', toolCount: 5 },
];

export function getFamily(familyId: ChartFamilyId): ChartFamily {
  return CHART_FAMILIES.find((family) => family.id === familyId) ?? CHART_FAMILIES[0];
}

export function getCategory(categoryId: string): ChartCategory | undefined {
  return CHART_CATEGORIES.find((category) => category.id === categoryId);
}
