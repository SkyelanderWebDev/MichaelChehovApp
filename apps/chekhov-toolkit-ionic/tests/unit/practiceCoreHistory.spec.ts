import { describe, expect, test } from 'vitest'
import {
  addPOANote,
  completeTodayPractice,
  getDrawHistory,
  getPOANotes,
  getPracticeHistory,
  saveFlybackNote,
} from '@/stores/dailyPracticeStore'
import {
  createAllChildToolFilter,
  createAllParentToolFilter,
  createRandomSelectionFromCategories,
} from '@/data/toolCatalog'
import { CHART_CATEGORIES } from '@/data/circleChartCatalog'

const PRACTICE_ID = '00000000-0000-0000-0000-000000000000'
const ALL_CATEGORY_IDS = CHART_CATEGORIES.map((category) => category.id)

describe('practice-core history/lock store seam', () => {
  test('new persistence fns do not fall back without Supabase auth', async () => {
    expect(await completeTodayPractice('2026-06-24')).toBeNull()
    expect(await saveFlybackNote('A quick reflection.', '2026-06-24')).toBeNull()
    expect(await addPOANote(PRACTICE_ID, 'A post-lock note.')).toBeNull()
    expect(await getPOANotes(PRACTICE_ID)).toEqual([])
    expect(await getDrawHistory('2026-06-24')).toEqual([])
    expect(await getDrawHistory()).toEqual([])
    expect(await getPracticeHistory()).toEqual([])
  })

  test('empty/whitespace post-lock note is rejected before persistence', async () => {
    expect(await addPOANote(PRACTICE_ID, '   ')).toBeNull()
  })
})

describe('G5 Journal Draw Random includes the Unveiled value', () => {
  test('includeUnveiling produces a numeric unveiled value', () => {
    const selection = createRandomSelectionFromCategories(
      ALL_CATEGORY_IDS,
      createAllParentToolFilter(),
      createAllChildToolFilter(),
      { includeUnveiling: true },
    )

    expect(selection).not.toBeNull()
    expect(typeof selection?.unveiledValue).toBe('number')
  })

  test('omitting the option leaves the unveiled value null', () => {
    const selection = createRandomSelectionFromCategories(
      ALL_CATEGORY_IDS,
      createAllParentToolFilter(),
      createAllChildToolFilter(),
    )

    expect(selection).not.toBeNull()
    expect(selection?.unveiledValue ?? null).toBeNull()
  })
})
