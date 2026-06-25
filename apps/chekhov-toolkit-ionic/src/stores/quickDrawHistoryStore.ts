import { ref } from 'vue';
import type { PracticeToolSelection } from '@/types/practice';

/**
 * Chart Quick-Draw history.
 *
 * Product owner (Wave 1) confirmed chart Quick Draws are now logged. This log is
 * deliberately SEPARATE from the Supabase `draw_history` / committed-practice
 * history surfaced in the Journal tab:
 *  - Chart Quick Draw is a read-only exploration that never starts or locks a day,
 *    so its draws must not appear under any Journal practice day.
 *  - It must keep working signed-out and with the practice-core migration
 *    (20260624120000_*) NOT applied, so it cannot depend on Supabase.
 *
 * It is therefore a local, device-scoped log persisted to localStorage. No POA,
 * no lock state, no NMCA-invented copy — only the drawn taxonomy selection.
 */
export interface QuickDrawHistoryEntry {
  id: string;
  drawnAt: string;
  selectedTool: PracticeToolSelection;
}

const STORAGE_KEY = 'mct-wave1:chart-quick-draws';
const MAX_ENTRIES = 50;

const entriesRef = ref<QuickDrawHistoryEntry[]>([]);

/** Reactive, newest-first list of past Chart Quick Draws. */
export const quickDrawHistory = entriesRef;

function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function persist(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entriesRef.value));
  } catch {
    // Storage full / unavailable: keep the in-memory log and move on.
  }
}

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to a timestamp-based id
  }
  return `qd-${Date.now()}-${entriesRef.value.length}`;
}

/** Hydrate the in-memory log from localStorage. Safe to call repeatedly. */
export function loadQuickDrawHistory(): QuickDrawHistoryEntry[] {
  const storage = getStorage();
  if (!storage) {
    entriesRef.value = [];
    return entriesRef.value;
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    entriesRef.value = Array.isArray(parsed)
      ? (parsed.filter(isQuickDrawEntry) as QuickDrawHistoryEntry[])
      : [];
  } catch {
    entriesRef.value = [];
  }

  return entriesRef.value;
}

/** Append one Chart Quick Draw. Newest-first; capped at {@link MAX_ENTRIES}. */
export function logQuickDraw(selectedTool: PracticeToolSelection): QuickDrawHistoryEntry {
  const entry: QuickDrawHistoryEntry = {
    id: makeId(),
    drawnAt: new Date().toISOString(),
    selectedTool,
  };

  entriesRef.value = [entry, ...entriesRef.value].slice(0, MAX_ENTRIES);
  persist();

  return entry;
}

/** Read the current log (newest-first). */
export function getQuickDrawHistory(): QuickDrawHistoryEntry[] {
  return entriesRef.value;
}

/** Clear the Chart Quick-Draw log. */
export function clearQuickDrawHistory(): void {
  entriesRef.value = [];
  persist();
}

function isQuickDrawEntry(value: unknown): value is QuickDrawHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.drawnAt === 'string' &&
    Boolean(entry.selectedTool) &&
    typeof entry.selectedTool === 'object'
  );
}
