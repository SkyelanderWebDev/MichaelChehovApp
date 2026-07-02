import { describe, expect, it } from 'vitest';
import { CHART_CATEGORIES, CHART_FAMILIES } from '@/data/circleChartCatalog';
import {
  WEEKEND_TOOL_CATALOG,
  createAllParentToolFilter,
  createEmptyChildToolFilter,
  createRandomSelectionFromCategories,
  getDrawableTools,
  getToolCatalogCategory,
} from '@/data/toolCatalog';

// 2026-07-02 sprint contract: 16 categories, families contiguous, numbered
// 1–3 PsychoPhysical, 4–6 Characterization, 7–10 Emotional Life,
// 11–13 Esthetics, 14–16 Transformation.
const EXPECTED_ORDER = [
  'expanding-contracting',
  'qualities-of-movement',
  'archetypal-gestures',
  'movable-centers',
  'imaginary-body',
  'trinity-of-psychology',
  'three-sisters',
  'qualities-sensations',
  'atmosphere',
  'four-brothers',
  'ensemble',
  'truth',
  'style',
  'tempo-rhythm',
  'focal-points',
  'psychological-gesture',
];

describe('chart taxonomy order (2026-07-02)', () => {
  it('has 16 categories in the approved order', () => {
    expect(CHART_CATEGORIES.map((category) => category.id)).toEqual(EXPECTED_ORDER);
  });

  it('groups families contiguously in the approved family order', () => {
    const familyRuns: string[] = [];
    for (const category of CHART_CATEGORIES) {
      if (familyRuns[familyRuns.length - 1] !== category.family) {
        familyRuns.push(category.family);
      }
    }

    expect(familyRuns).toEqual([
      'psycho-physical',
      'characterization',
      'emotional-life',
      'esthetics',
      'transformation',
    ]);
    // Contiguous runs: each family appears exactly once in the run list.
    expect(new Set(familyRuns).size).toBe(familyRuns.length);
  });

  it('keeps CHART_FAMILIES in the same order as the chart numbering', () => {
    const familyRuns = [...new Set(CHART_CATEGORIES.map((category) => category.family))];
    expect(CHART_FAMILIES.map((family) => family.id)).toEqual(familyRuns);
  });

  it('numbers the family blocks 1–3, 4–6, 7–10, 11–13, 14–16', () => {
    const positions = (familyId: string) =>
      CHART_CATEGORIES.flatMap((category, index) => (category.family === familyId ? [index + 1] : []));

    expect(positions('psycho-physical')).toEqual([1, 2, 3]);
    expect(positions('characterization')).toEqual([4, 5, 6]);
    expect(positions('emotional-life')).toEqual([7, 8, 9, 10]);
    expect(positions('esthetics')).toEqual([11, 12, 13]);
    expect(positions('transformation')).toEqual([14, 15, 16]);
  });

  it('has a tool-catalog entry for every chart category', () => {
    for (const category of CHART_CATEGORIES) {
      expect(getToolCatalogCategory(category.id), `catalog entry for ${category.id}`).toBeDefined();
    }
    expect(WEEKEND_TOOL_CATALOG).toHaveLength(CHART_CATEGORIES.length);
  });
});

describe('Psychological Gesture (category 16)', () => {
  const chartEntry = CHART_CATEGORIES.find((category) => category.id === 'psychological-gesture');
  const catalogEntry = getToolCatalogCategory('psychological-gesture');

  it('is category 16 under Transformation with the exact approved description', () => {
    expect(CHART_CATEGORIES[15]?.id).toBe('psychological-gesture');
    expect(chartEntry?.name).toBe('Psychological Gesture');
    expect(chartEntry?.family).toBe('transformation');
    expect(chartEntry?.toolCount).toBe(3);
    expect(chartEntry?.description).toBe(
      'Psychological Gesture = Archetypal Gesture (Pure Will / what) + Feeling (how) + Thinking (why)',
    );
  });

  it('uses exactly the approved parent/child scaffold', () => {
    expect(catalogEntry?.tools.map((tool) => tool.name)).toEqual(['Inspiration', 'Imagination', 'Intellect']);
    expect(catalogEntry?.tools[0].children).toEqual([]);
    expect(catalogEntry?.tools[1].children).toEqual(['Body', 'Behavior', 'Activity']);
    expect(catalogEntry?.tools[2].children).toEqual(['Way', 'Win', 'Loss']);
  });

  it('is not a Movable Centers-style multi-component recipe', () => {
    const selection = createRandomSelectionFromCategories(['psychological-gesture']);
    expect(selection).not.toBeNull();
    expect(selection?.components).toBeUndefined();
  });

  it('is drawable immediately with all three parents in the pool', () => {
    const drawable = getDrawableTools('psychological-gesture');
    expect(drawable.map((candidate) => candidate.tool.name)).toEqual(['Inspiration', 'Imagination', 'Intellect']);
  });

  it('keeps parent-only Inspiration drawable with a null child', () => {
    const parentFilter = { ...createAllParentToolFilter(), 'psychological-gesture': ['Inspiration'] };
    const selection = createRandomSelectionFromCategories(['psychological-gesture'], parentFilter);

    expect(selection?.categoryId).toBe('psychological-gesture');
    expect(selection?.parentToolName).toBe('Inspiration');
    expect(selection?.childToolName).toBeNull();
  });

  it('draws at parent level when all example labels are cleared', () => {
    const selection = createRandomSelectionFromCategories(
      ['psychological-gesture'],
      createAllParentToolFilter(),
      createEmptyChildToolFilter(),
    );

    expect(selection?.categoryId).toBe('psychological-gesture');
    expect(['Inspiration', 'Imagination', 'Intellect']).toContain(selection?.parentToolName);
    expect(selection?.childToolName).toBeNull();
  });

  it('can draw a child label from Imagination or Intellect when examples are selected', () => {
    const parentFilter = { ...createAllParentToolFilter(), 'psychological-gesture': ['Imagination', 'Intellect'] };

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const selection = createRandomSelectionFromCategories(['psychological-gesture'], parentFilter);
      expect(['Imagination', 'Intellect']).toContain(selection?.parentToolName);
      expect(['Body', 'Behavior', 'Activity', 'Way', 'Win', 'Loss']).toContain(selection?.childToolName);
    }
  });
});
