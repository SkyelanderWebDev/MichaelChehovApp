import { describe, expect, test } from 'vitest'
import { drawNextQuickTool, isQuickDrawLocked } from '@/data/quickDrawLock'
import type { PracticeToolSelection } from '@/types/practice'

function singleSelection(parentToolName: string, childToolName: string): PracticeToolSelection {
  return {
    categoryId: 'expanding-contracting',
    categoryName: 'Expanding & Contracting',
    parentToolName,
    childToolName,
    scaleValue: null,
    unveiledValue: null,
  }
}

function movableSelection(location: string, movement: string, quality: string): PracticeToolSelection {
  return {
    categoryId: 'movable-centers',
    categoryName: 'Movable Centers',
    parentToolName: 'Location',
    childToolName: location,
    components: [
      { label: 'Location', value: location },
      { label: 'Movement', value: movement },
      { label: 'Quality', value: quality },
    ],
    scaleValue: null,
    unveiledValue: null,
  }
}

// Movable Centers source parent names are Location / Mobility / Quality;
// the drawn component LABELS are Location / Movement / Quality.
function movableFilters(pools: { Location: string[]; Mobility: string[]; Quality: string[] }) {
  return {
    parentFilter: { 'movable-centers': ['Location', 'Mobility', 'Quality'] },
    childFilter: { 'movable-centers': { ...pools } },
  }
}

function byLabel(selection: PracticeToolSelection | null): Record<string, string> {
  return Object.fromEntries((selection?.components ?? []).map((component) => [component.label, component.value]))
}

const NONE_LOCKED = { singleLocked: false, lockedComponentLabels: new Set<string>() }

describe('Quick Draw device-local result lock', () => {
  test('single-result lock keeps the exact value across "Draw another"', () => {
    const previous = singleSelection('Expanding', 'Opening')

    const result = drawNextQuickTool(
      previous,
      { singleLocked: true, lockedComponentLabels: new Set() },
      { categoryIds: ['expanding-contracting'] },
    )

    expect(result).toBe(previous)
  })

  test('unlocked single result re-rolls a fresh value', () => {
    const previous = singleSelection('Expanding', 'Opening')

    // Narrow the pool to a single different option so the fresh re-roll is deterministic.
    const result = drawNextQuickTool(previous, NONE_LOCKED, {
      categoryIds: ['expanding-contracting'],
      parentFilter: { 'expanding-contracting': ['Contracting'] },
      childFilter: { 'expanding-contracting': { Contracting: ['Closing'] } },
    })

    expect(result).not.toBe(previous)
    expect(result).toMatchObject({ parentToolName: 'Contracting', childToolName: 'Closing' })
  })

  test('Movable Centers: locking one component preserves it while the rest re-roll', () => {
    const previous = movableSelection('Head', 'Spinning', 'Warm')
    const { parentFilter, childFilter } = movableFilters({
      Location: ['Crown'], // fresh pool excludes 'Head' — proves preservation, not luck
      Mobility: ['Drifting'],
      Quality: ['Icy'],
    })

    const result = drawNextQuickTool(
      previous,
      { singleLocked: false, lockedComponentLabels: new Set(['Location']) },
      { categoryIds: ['movable-centers'], parentFilter, childFilter },
    )

    const values = byLabel(result)
    expect(values.Location).toBe('Head') // locked → preserved
    expect(values.Movement).toBe('Drifting') // unlocked → re-rolled
    expect(values.Quality).toBe('Icy') // unlocked → re-rolled
  })

  test('Movable Centers: locking two components preserves both while the third re-rolls', () => {
    const previous = movableSelection('Head', 'Spinning', 'Warm')
    const { parentFilter, childFilter } = movableFilters({
      Location: ['Crown'],
      Mobility: ['Drifting'],
      Quality: ['Icy'],
    })

    const result = drawNextQuickTool(
      previous,
      { singleLocked: false, lockedComponentLabels: new Set(['Location', 'Quality']) },
      { categoryIds: ['movable-centers'], parentFilter, childFilter },
    )

    const values = byLabel(result)
    expect(values.Location).toBe('Head') // locked → preserved
    expect(values.Quality).toBe('Warm') // locked → preserved
    expect(values.Movement).toBe('Drifting') // only unlocked slot re-rolls
  })

  test('Movable Centers: all components locked is a no-op', () => {
    const previous = movableSelection('Head', 'Spinning', 'Warm')
    const { parentFilter, childFilter } = movableFilters({
      Location: ['Crown'],
      Mobility: ['Drifting'],
      Quality: ['Icy'],
    })

    const lock = { singleLocked: false, lockedComponentLabels: new Set(['Location', 'Movement', 'Quality']) }
    expect(isQuickDrawLocked(previous, lock)).toBe(true)

    const result = drawNextQuickTool(previous, lock, {
      categoryIds: ['movable-centers'],
      parentFilter,
      childFilter,
    })

    expect(result).toBe(previous)
  })

  test('Movable Centers: nothing locked is a full re-roll of every component', () => {
    const previous = movableSelection('Head', 'Spinning', 'Warm')
    const { parentFilter, childFilter } = movableFilters({
      Location: ['Crown'],
      Mobility: ['Drifting'],
      Quality: ['Icy'],
    })

    const result = drawNextQuickTool(previous, NONE_LOCKED, {
      categoryIds: ['movable-centers'],
      parentFilter,
      childFilter,
    })

    const values = byLabel(result)
    expect(values.Location).toBe('Crown')
    expect(values.Movement).toBe('Drifting')
    expect(values.Quality).toBe('Icy')
  })

  test('isQuickDrawLocked is false with no result and respects partial component locks', () => {
    expect(isQuickDrawLocked(null, { singleLocked: true, lockedComponentLabels: new Set() })).toBe(false)

    const previous = movableSelection('Head', 'Spinning', 'Warm')
    expect(
      isQuickDrawLocked(previous, { singleLocked: false, lockedComponentLabels: new Set(['Location']) }),
    ).toBe(false)
  })
})
