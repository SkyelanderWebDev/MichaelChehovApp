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

// Weekend pilot catalog copied from client/src/lib/toolData.ts category names.
// Keep these names aligned with the NMCA/Chekhov taxonomy source; do not casually rename.
export const CHART_CATEGORIES: ChartCategory[] = [
  { id: 'expanding-contracting', name: 'Expanding & Contracting', family: 'psycho-physical', toolCount: 2 },
  { id: 'qualities-of-movement', name: 'Qualities of Movement', family: 'psycho-physical', toolCount: 7 },
  { id: 'archetypal-gestures', name: 'Archetypal Gestures', family: 'psycho-physical', toolCount: 10 },
  { id: 'three-sisters', name: 'Three Sister Sensations of Equilibrium', family: 'emotional-life', toolCount: 3 },
  { id: 'qualities-sensations', name: 'Qualities & Sensations', family: 'emotional-life', toolCount: 9 },
  { id: 'atmosphere', name: 'Atmosphere', family: 'emotional-life', toolCount: 9 },
  { id: 'four-brothers', name: 'Four Brothers of Art', family: 'emotional-life', toolCount: 4 },
  { id: 'ensemble', name: 'Ensemble', family: 'esthetics', toolCount: 6 },
  { id: 'truth', name: 'Truth', family: 'esthetics', toolCount: 7 },
  { id: 'style', name: 'Style', family: 'esthetics', toolCount: 4 },
  { id: 'movable-centers', name: 'Movable Centers', family: 'characterization', toolCount: 3 },
  { id: 'imaginary-body', name: 'Imaginary Body', family: 'characterization', toolCount: 7 },
  { id: 'trinity-of-psychology', name: 'Trinity of Psychology', family: 'characterization', toolCount: 3 },
  { id: 'tempo-rhythm', name: 'Tempo / Rhythm', family: 'transformation', toolCount: 5 },
  { id: 'focal-points', name: 'Focal Points of Concentration', family: 'transformation', toolCount: 5 },
];

export function getFamily(familyId: ChartFamilyId): ChartFamily {
  return CHART_FAMILIES.find((family) => family.id === familyId) ?? CHART_FAMILIES[0];
}

export function getCategory(categoryId: string): ChartCategory | undefined {
  return CHART_CATEGORIES.find((category) => category.id === categoryId);
}
