import {
  createMovableCenterRedraw,
  createRandomSelectionFromCategories,
  type ChildToolFilter,
  type ParentToolFilter,
} from './toolCatalog';
import type { PracticeToolSelection } from '@/types/practice';

/**
 * Device-local lock state for the Chart tab's Quick Draw.
 *
 * Kept deliberately SEPARATE from the Journal daily-practice lock
 * (dailyPracticeStore) and from the Quick-Draw history log
 * (quickDrawHistoryStore). Locking only changes what the NEXT chart re-roll
 * ("Draw another") keeps versus re-rolls — it never starts, saves, or locks a
 * practice day, and never touches Supabase.
 *
 * Two shapes of result:
 *  - Single-result tools: one `singleLocked` flag. Locked → "Draw another" keeps
 *    the current result unchanged.
 *  - Movable Centers: a per-component lock keyed by the stable component label
 *    (Location / Movement / Quality). "Draw another" re-rolls only the unlocked
 *    components and preserves the locked ones.
 */
export interface QuickDrawLockState {
  singleLocked: boolean;
  lockedComponentLabels: ReadonlySet<string>;
}

export interface QuickDrawParams {
  categoryIds: readonly string[];
  parentFilter?: ParentToolFilter;
  childFilter?: ChildToolFilter;
  includeUnveiling?: boolean;
}

/** True when the current result is fully locked, so a re-roll would be a no-op. */
export function isQuickDrawLocked(
  result: PracticeToolSelection | null,
  lock: QuickDrawLockState,
): boolean {
  if (!result) return false;
  if (result.components?.length) {
    return result.components.every((component) => lock.lockedComponentLabels.has(component.label));
  }
  return lock.singleLocked;
}

/**
 * Compute the result of pressing "Draw another" given the current result and the
 * device-local lock state. Pure: no Supabase, no history side effects, no draw of
 * a started/committed practice day.
 */
export function drawNextQuickTool(
  previous: PracticeToolSelection | null,
  lock: QuickDrawLockState,
  params: QuickDrawParams,
): PracticeToolSelection | null {
  // Fully locked (single result, or every Movable Centers component): no change.
  if (isQuickDrawLocked(previous, lock)) return previous;

  const options = { includeUnveiling: Boolean(params.includeUnveiling) };

  // Movable Centers with at least one locked component: stay in Movable Centers
  // and re-roll ONLY the unlocked component slots.
  if (
    previous?.components?.length &&
    previous.categoryId === 'movable-centers' &&
    lock.lockedComponentLabels.size > 0
  ) {
    return createMovableCenterRedraw(
      previous.components,
      lock.lockedComponentLabels,
      params.parentFilter,
      params.childFilter,
      options,
    );
  }

  // Otherwise a fresh draw across the selected pool (single-result re-roll, or a
  // Movable Centers draw with nothing locked).
  return createRandomSelectionFromCategories(
    params.categoryIds,
    params.parentFilter,
    params.childFilter,
    options,
  );
}
