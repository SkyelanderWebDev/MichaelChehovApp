import { describe, expect, test } from 'vitest'
import { CHART_CATEGORIES } from '@/data/circleChartCatalog'
import {
  childExamplesToggleLabel,
  createAllChildToolFilter,
  createAllParentToolFilter,
  createEmptyChildToolFilter,
  getChildExamplesSelectionState,
  getDrawableSelectionCount,
  isAllChildToolsSelected,
  isNoChildToolsSelected,
  toggleAllChildTools,
  type ChildToolFilter,
  type ParentToolFilter,
} from '@/data/toolCatalog'

function poolToolCount(parentFilter: ParentToolFilter, childFilter: ChildToolFilter): number {
  return CHART_CATEGORIES.reduce(
    (count, category) => count + getDrawableSelectionCount(category.id, parentFilter, childFilter),
    0,
  )
}

describe('global examples toggle (Chart + Journal pools)', () => {
  test('createEmptyChildToolFilter selects no example labels but keeps every parent entry', () => {
    const empty = createEmptyChildToolFilter()

    for (const category of CHART_CATEGORIES) {
      expect(empty[category.id]).toBeDefined()
    }
    expect(isNoChildToolsSelected(empty)).toBe(true)
    expect(isAllChildToolsSelected(empty)).toBe(false)
  })

  test('state helpers report all / none correctly for the full and empty filters', () => {
    expect(isAllChildToolsSelected(createAllChildToolFilter())).toBe(true)
    expect(isNoChildToolsSelected(createAllChildToolFilter())).toBe(false)

    expect(isAllChildToolsSelected(createEmptyChildToolFilter())).toBe(false)
    expect(isNoChildToolsSelected(createEmptyChildToolFilter())).toBe(true)
  })

  test('toggleAllChildTools clears every example when all are selected', () => {
    const cleared = toggleAllChildTools(createAllChildToolFilter())

    expect(isNoChildToolsSelected(cleared)).toBe(true)
    expect(isAllChildToolsSelected(cleared)).toBe(false)
  })

  test('toggleAllChildTools selects every example when none (or some) are selected', () => {
    const fromEmpty = toggleAllChildTools(createEmptyChildToolFilter())
    expect(isAllChildToolsSelected(fromEmpty)).toBe(true)

    // Mixed state (not all-on) also resolves to "all selected".
    const mixed = createAllChildToolFilter()
    mixed['four-brothers'].Beauty = []
    expect(isAllChildToolsSelected(mixed)).toBe(false)
    expect(isNoChildToolsSelected(mixed)).toBe(false)
    expect(isAllChildToolsSelected(toggleAllChildTools(mixed))).toBe(true)
  })

  test('tri-state label never claims "All examples" for a partial selection', () => {
    expect(childExamplesToggleLabel(createAllChildToolFilter())).toBe('All examples')
    expect(childExamplesToggleLabel(createEmptyChildToolFilter())).toBe('No examples')

    const mixed = createAllChildToolFilter()
    mixed['four-brothers'].Beauty = []
    expect(getChildExamplesSelectionState(mixed)).toBe('some')
    expect(childExamplesToggleLabel(mixed)).toBe('Some examples')

    expect(getChildExamplesSelectionState(createAllChildToolFilter())).toBe('all')
    expect(getChildExamplesSelectionState(createEmptyChildToolFilter())).toBe('none')
  })

  test('Journal Draw pool count reflects the toggled child filter', () => {
    const parentFilter = createAllParentToolFilter()

    const withExamples = poolToolCount(parentFilter, createAllChildToolFilter())
    const clearedFilter = toggleAllChildTools(createAllChildToolFilter())
    const withoutExamples = poolToolCount(parentFilter, clearedFilter)

    // Movable Centers needs all three component examples to stay drawable, so
    // clearing every example label drops it from the pool count.
    expect(withoutExamples).toBeLessThan(withExamples)
    expect(getDrawableSelectionCount('movable-centers', parentFilter, createAllChildToolFilter())).toBe(1)
    expect(getDrawableSelectionCount('movable-centers', parentFilter, clearedFilter)).toBe(0)

    // Re-toggling restores the full pool count.
    const restored = poolToolCount(parentFilter, toggleAllChildTools(clearedFilter))
    expect(restored).toBe(withExamples)
  })
})
