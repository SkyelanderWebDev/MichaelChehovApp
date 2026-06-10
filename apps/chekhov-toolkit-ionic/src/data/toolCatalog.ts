import type { PracticeToolSelection } from '@/types/practice';
import { CHART_CATEGORIES, type ChartCategory } from './circleChartCatalog';

export interface WeekendTool {
  name: string;
  children: readonly string[];
}

export interface WeekendToolCategory {
  categoryId: string;
  tools: readonly WeekendTool[];
  hasScale?: boolean;
}

// Weekend seed data copied from client/src/lib/toolData.ts into Vue-safe plain objects.
// This is taxonomy/label data only; it does not add generated embodied practice prompts.
export const WEEKEND_TOOL_CATALOG: readonly WeekendToolCategory[] = [
  {
    categoryId: 'expanding-contracting',
    tools: [
      { name: 'Expanding', children: ['Opening', 'Growing', 'Blossoming', 'Bigger'] },
      { name: 'Contracting', children: ['Closing', 'Shrinking', 'Wilting', 'Smaller'] },
    ],
  },
  {
    categoryId: 'qualities-of-movement',
    tools: [
      { name: 'Molding (Earth)', children: ['Diamond', 'Solid Rock', 'Granite', 'Packed Earth'] },
      { name: 'Flowing (Water)', children: ['Ocean Wave', 'Flood', 'River Current', 'Waterfall'] },
      { name: 'Flying (Air)', children: ['Heavy Pelican', 'Jet Plane', 'Eagle', 'Hawk'] },
      { name: 'Radiating (Fire)', children: ['Wildfire', 'Bonfire', 'Campfire', 'Sacrificial Fire'] },
      { name: 'Radiating (Sunlight)', children: ['Blazing Noon', 'Golden Hour', 'Dawn Light', 'Morning Glow'] },
      { name: 'Radiating (Lightning)', children: ['Bolt', 'Thunderclap', 'Striking', 'Flashing'] },
      { name: 'Radiating (Laser)', children: ['Piercing', 'Cutting', 'Precise', 'Unwavering'] },
    ],
  },
  {
    categoryId: 'archetypal-gestures',
    tools: [
      { name: 'Push', children: ['Nudge', 'Shove', 'Press', 'Thrust'] },
      { name: 'Pull', children: ['Tug', 'Yank', 'Draw', 'Haul'] },
      { name: 'Lift', children: ['Raise', 'Hoist', 'Elevate', 'Uplift'] },
      { name: 'Smash', children: ['Crush', 'Shatter', 'Pound', 'Demolish'] },
      { name: 'Throw', children: ['Toss', 'Hurl', 'Fling', 'Lob'] },
      { name: 'Gather', children: ['Collect', 'Assemble', 'Bundle', 'Harvest'] },
      { name: 'Drag', children: ['Haul', 'Lug', 'Trail', 'Tow'] },
      { name: 'Tear', children: ['Rip', 'Shred', 'Rend', 'Split'] },
      { name: 'Penetrate', children: ['Pierce', 'Stab', 'Puncture', 'Bore'] },
      { name: 'Reach', children: ['Extend', 'Stretch', 'Grasp', 'Strain'] },
    ],
  },
  {
    categoryId: 'three-sisters',
    tools: [
      { name: 'Falling', children: ['Falling to Pieces', 'Falling Asleep', 'Falling in Love', 'Fall Flat'] },
      { name: 'Floating', children: ['Head in the Clouds', 'Spaced Out', 'Walking on Air', 'Riding High'] },
      { name: 'Balancing', children: ['Hanging in the Balance', 'On the Edge', 'Strike a Balance', 'In Limbo'] },
    ],
  },
  {
    categoryId: 'qualities-sensations',
    tools: [
      { name: 'Qualities (Colors)', children: ['Red', 'Orange', 'Yellow', 'Gold'] },
      { name: 'Qualities (Textures)', children: ['Silky', 'Velvety', 'Rough', 'Coarse'] },
      { name: 'Qualities (Animals)', children: ['Hawk', 'Serpent', 'Cat', 'Bear'] },
      { name: 'Qualities (Nature)', children: ['Mist', 'Stone', 'Sand', 'Storm'] },
      { name: 'Qualities (Temperature)', children: ['Freezing', 'Glacial', 'Cold', 'Cool'] },
      { name: 'Qualities (Tempo & Rhythm)', children: ['Urgent', 'Languid', 'Frenetic', 'Measured'] },
      { name: 'Qualities (Emotional Adverbs)', children: ['Angrily', 'Tenderly', 'Vivaciously', 'Joyfully'] },
      { name: 'Sensations', children: ['Danger', 'Unease', 'Exhilaration', 'Vertigo'] },
      { name: 'Feelings', children: ['Love / Joy / Happiness / Peace / Contentment', 'Awe / Wonder / Amazement / Surprise'] },
    ],
  },
  {
    categoryId: 'atmosphere',
    tools: [
      { name: 'Overall — Nature / Natural', children: ['Pre-Storm Stillness', 'Distant Thunder', 'Thunderstorm', 'Hard Driving Rain'] },
      { name: 'Overall — Events & Occasions', children: ['Wedding', 'Funeral', 'Birthday Party', 'Graduation'] },
      { name: 'Overall — Architectural', children: ['Tomb', 'Cathedral', 'Chapel', 'Castle'] },
      { name: 'Overall — Emotional', children: ['Joyous', 'Depressing', 'Grievous', 'Terrifying'] },
      { name: 'Overall — Random Images & Idioms', children: ['Walking on Eggshells', 'Breaking the Ice', 'Under a Cloud', 'In the Spotlight'] },
      { name: 'Personal — The "-ness" Essences', children: ['Pretentiousness', 'Humbleness', 'Meekness', 'Kindness'] },
      { name: 'Personal — The "-ion" Essences', children: ['Condescension', 'Depression', 'Erudition', 'Devotion'] },
      { name: 'Personal — The "-ity" Essences', children: ['Humility', 'Futility', 'Authority', 'Gentility'] },
      { name: 'Personal — The "-ism" Essences', children: ['Optimism', 'Pessimism', 'Hedonism', 'Narcissism'] },
    ],
  },
  {
    categoryId: 'four-brothers',
    tools: [
      { name: 'Beauty', children: ['Elegance', 'Grace', 'Aesthetics', 'Harmony'] },
      { name: 'Ease', children: ['Flow', 'Comfort', 'Naturalness', 'Effortlessness'] },
      { name: 'Entirety', children: ['Wholeness', 'Completeness', 'Totality', 'Unity'] },
      { name: 'Form', children: ['Structure', 'Shape', 'Design', 'Architecture'] },
    ],
  },
  {
    categoryId: 'ensemble',
    tools: [
      { name: 'Listening', children: ['Active Listening', 'Responding', 'Being Present', 'Tuning In'] },
      { name: 'Supporting', children: ['Enabling', 'Uplifting', 'Backing', 'Assisting'] },
      { name: 'Leading', children: ['Guiding', 'Initiating', 'Directing', 'Inspiring'] },
      { name: 'Following', children: ['Yielding', 'Trusting', 'Joining', 'Adapting'] },
      { name: 'Mirroring', children: ['Reflecting', 'Echoing', 'Matching', 'Synchronizing'] },
      { name: 'Contrasting', children: ['Opposing', 'Balancing', 'Differentiating', 'Countering'] },
    ],
  },
  {
    categoryId: 'truth',
    tools: [
      { name: 'Stylistic Truth', children: ['Contemporary Realism', 'Classical Verse', 'Avant-Garde', 'Experimental'] },
      { name: 'Historical, Cultural & National Truth', children: ['Ancient Greek', 'Roman', 'Medieval European', 'Renaissance Italian'] },
      { name: 'Truth of the Given Circumstances', children: ['Who am I?', 'Where am I?', 'What time is it?', 'What do I want?'] },
      { name: 'Truth of the Character', children: ['Inner Life', 'Physical Life', 'Biography', 'Psychology'] },
      { name: 'Truth of the Relationship', children: ['Status Dynamic', 'Shared History', 'Unspoken Desire', 'Power Balance'] },
      { name: 'Truth of Reality vs. Pretend', children: ['The Magic If', 'As If', 'The Fourth Wall', 'Stage Reality'] },
      { name: 'Truth of the Mise en Scène', children: ['The Space', 'Objects & Props', 'Light & Shadow', 'Sound & Music'] },
    ],
  },
  {
    categoryId: 'style',
    tools: [
      { name: 'Style — Genres', children: ['Naturalism', 'Realism', 'Expressionism', 'Absurdism'] },
      { name: 'Style — Time Periods', children: ['Ancient Greek', 'Roman', 'Medieval', 'Renaissance'] },
      { name: 'Style — Physicality & Posture', children: ['Upright & Formal', 'Relaxed & Casual', 'Elevated & Grand', 'Compressed & Internal'] },
      { name: 'Style — Mannerisms', children: ['Deliberate Gesture', 'Habitual Tic', 'Social Affectation', 'Class Marker'] },
    ],
  },
  {
    categoryId: 'movable-centers',
    tools: [
      { name: 'Location', children: ['Head', 'Crown', 'Forehead', 'Eyes'] },
      { name: 'Quality', children: ['Warm', 'Cool', 'Buzzing', 'Heavy'] },
      { name: 'Mobility', children: ['Stationary', 'Rooted', 'Grounded', 'Anchored'] },
    ],
  },
  {
    categoryId: 'imaginary-body',
    tools: [
      { name: 'Body Part', children: ['Full Body', 'Head', 'Neck', 'Chest'] },
      { name: 'Substances', children: ['Jelly', 'Springs', 'Plastic', 'Metal'] },
      { name: 'Simple Forms', children: ['Ball', 'Spiral', 'Cylinder', 'Pendulum'] },
      { name: 'Mineral Kingdom', children: ['Crystal', 'Diamond', 'Obsidian', 'Granite'] },
      { name: 'Plant Kingdom', children: ['Oak Tree', 'Weeping Willow', 'Vine', 'Rose'] },
      { name: 'Animal Kingdom', children: ['Hawk', 'Serpent', 'Cat', 'Bear'] },
      { name: 'Archetypal Characters', children: ['Parent', 'Healer', 'Teacher', 'Orphan'] },
    ],
  },
  {
    categoryId: 'trinity-of-psychology',
    tools: [
      { name: 'Thinking', children: ['Analytic', 'Abstract', 'Divergent', 'Idealistic'] },
      { name: 'Feeling', children: ['Hypersensitive', 'Numb', 'Empathic', 'Thick-Skinned'] },
      { name: 'Willing', children: ['Fierce', 'Faint', 'Steadfast', 'Mercurial'] },
    ],
  },
  {
    categoryId: 'tempo-rhythm',
    hasScale: true,
    tools: [
      { name: 'Stillness', children: ['Pausing', 'Freezing', 'Holding', 'Waiting'] },
      { name: 'Legato', children: ['Smooth', 'Connected', 'Flowing', 'Continuous'] },
      { name: 'Lyrical', children: ['Graceful', 'Melodic', 'Expressive', 'Poetic'] },
      { name: 'Staccato', children: ['Sharp', 'Punctuated', 'Abrupt', 'Detached'] },
      { name: 'Chaos', children: ['Erratic', 'Unpredictable', 'Wild', 'Frenzied'] },
    ],
  },
  {
    categoryId: 'focal-points',
    tools: [
      { name: '1 (Me)', children: ['Self-Focus', 'Inner Awareness', 'Personal Center', 'My Body'] },
      { name: '2 (You/Partner)', children: ['Eye Contact', 'Connecting', 'Engaging', 'Responding'] },
      { name: '3 (Here/Physical Environment)', children: ['Space', 'Objects', 'Surroundings', 'Physical Reality'] },
      { name: '4 (Not Here/Mental Screen)', children: ['Imagination', 'Memory', 'Visualization', 'Inner Vision'] },
      { name: '5 (All/Nowhere/Void)', children: ['Everything', 'Nothing', 'Universe', 'Emptiness'] },
    ],
  },
];

// Map of categoryId -> parent tool names currently included in the draw pool.
export type ParentToolFilter = Record<string, string[]>;

export function getToolCatalogCategory(categoryId: string): WeekendToolCategory | undefined {
  return WEEKEND_TOOL_CATALOG.find((category) => category.categoryId === categoryId);
}

export function getCategoriesWithToolSeeds(categoryIds: readonly string[]): ChartCategory[] {
  const categoryIdSet = new Set(categoryIds);

  return CHART_CATEGORIES.filter(
    (category) => categoryIdSet.has(category.id) && Boolean(getToolCatalogCategory(category.id)),
  );
}

export function createAllParentToolFilter(): ParentToolFilter {
  const filter: ParentToolFilter = {};
  for (const category of WEEKEND_TOOL_CATALOG) {
    filter[category.categoryId] = category.tools.map((tool) => tool.name);
  }
  return filter;
}

export function getFilteredTools(categoryId: string, filter?: ParentToolFilter): WeekendTool[] {
  const catalogCategory = getToolCatalogCategory(categoryId);
  if (!catalogCategory) return [];
  if (!filter || !(categoryId in filter)) return [...catalogCategory.tools];

  const allowed = new Set(filter[categoryId]);
  return catalogCategory.tools.filter((tool) => allowed.has(tool.name));
}

export function createFirstSelectionForCategory(categoryId: string): PracticeToolSelection | null {
  const chartCategory = getChartCategory(categoryId);
  const catalogCategory = getToolCatalogCategory(categoryId);
  const firstTool = catalogCategory?.tools[0];

  if (!chartCategory || !firstTool) return null;

  return makeSelection(chartCategory, catalogCategory, firstTool, firstTool.children[0] ?? null);
}

export function createSelectionForParentTool(categoryId: string, parentToolName: string): PracticeToolSelection | null {
  const chartCategory = getChartCategory(categoryId);
  const catalogCategory = getToolCatalogCategory(categoryId);
  const tool = catalogCategory?.tools.find((candidate) => candidate.name === parentToolName);

  if (!chartCategory || !catalogCategory || !tool) return null;

  return makeSelection(chartCategory, catalogCategory, tool, pickOne(tool.children) ?? null);
}

export function createRandomSelectionFromCategories(
  categoryIds: readonly string[],
  filter?: ParentToolFilter,
): PracticeToolSelection | null {
  const categories = getCategoriesWithToolSeeds(categoryIds).filter(
    (category) => getFilteredTools(category.id, filter).length > 0,
  );
  const chartCategory = pickOne(categories);
  if (!chartCategory) return null;

  const catalogCategory = getToolCatalogCategory(chartCategory.id);
  const tool = pickOne(getFilteredTools(chartCategory.id, filter));
  if (!catalogCategory || !tool) return null;

  return makeSelection(chartCategory, catalogCategory, tool, pickOne(tool.children) ?? null);
}

export function createDailyToolSelection(localDate: string): PracticeToolSelection {
  const categories = CHART_CATEGORIES.filter((category) => Boolean(getToolCatalogCategory(category.id)));
  const categoryIndex = seededIndex(localDate, categories.length);
  const chartCategory = categories[categoryIndex] ?? categories[0];
  const catalogCategory = getToolCatalogCategory(chartCategory.id) ?? WEEKEND_TOOL_CATALOG[0];
  const toolIndex = seededIndex(`${localDate}:${chartCategory.id}`, catalogCategory.tools.length);
  const tool = catalogCategory.tools[toolIndex] ?? catalogCategory.tools[0];
  const childIndex = seededIndex(`${localDate}:${chartCategory.id}:${tool.name}`, tool.children.length);

  return makeSelection(chartCategory, catalogCategory, tool, tool.children[childIndex] ?? null);
}

function getChartCategory(categoryId: string): ChartCategory | undefined {
  return CHART_CATEGORIES.find((category) => category.id === categoryId);
}

function makeSelection(
  chartCategory: ChartCategory,
  catalogCategory: WeekendToolCategory,
  tool: WeekendTool,
  childToolName: string | null,
): PracticeToolSelection {
  return {
    categoryId: chartCategory.id,
    categoryName: chartCategory.name,
    parentToolName: tool.name,
    childToolName,
    scaleValue: catalogCategory.hasScale ? seededIndex(`${chartCategory.id}:${tool.name}`, 7) + 1 : null,
    unveiledValue: null,
  };
}

function pickOne<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;

  return items[Math.floor(Math.random() * items.length)];
}

function seededIndex(seed: string, modulo: number): number {
  if (modulo <= 1) return 0;

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash % modulo;
}
