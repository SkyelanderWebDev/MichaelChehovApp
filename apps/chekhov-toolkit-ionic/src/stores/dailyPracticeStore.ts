import type { DailyPractice, POAEntry, PracticeSource, PracticeToolSelection } from '@/types/practice';

const STORAGE_PREFIX = 'mct-weekend-beta:';

// Local demo auth scoping: when a user is signed in, daily practice and POA
// keys are namespaced per user id so each local account keeps its own day.
// Guest (signed-out) practice keeps the original un-scoped keys.
let storageScopeUserId: string | null = null;

export function setPracticeStorageScope(userId: string | null): void {
  storageScopeUserId = userId;
}

function scopedPrefix(): string {
  return storageScopeUserId ? `${STORAGE_PREFIX}u:${storageScopeUserId}:` : STORAGE_PREFIX;
}

export function getLocalDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTodayPractice(localDate = getLocalDate()): DailyPractice | null {
  return readJson<DailyPractice>(dailyPracticeKey(localDate));
}

export function setPreview(
  selectedTool: PracticeToolSelection,
  source: PracticeSource,
  localDate = getLocalDate(),
): DailyPractice {
  const existing = getTodayPractice(localDate);

  if (existing?.status === 'started') {
    return existing;
  }

  const now = new Date().toISOString();
  const practice: DailyPractice = {
    id: existing?.id ?? `daily-practice:${localDate}`,
    localDate,
    source,
    status: 'preview',
    selectedTool,
    updatedAt: now,
  };

  writeJson(dailyPracticeKey(localDate), practice);

  return practice;
}

export function startTodayPractice(localDate = getLocalDate()): DailyPractice | null {
  const existing = getTodayPractice(localDate);
  if (!existing) return null;
  if (existing.status === 'started') return existing;

  const now = new Date().toISOString();
  const startedPractice: DailyPractice = {
    ...existing,
    status: 'started',
    startedAt: now,
    updatedAt: now,
  };

  writeJson(dailyPracticeKey(localDate), startedPractice);

  return startedPractice;
}

export function getPOA(dailyPracticeId: string): POAEntry | null {
  const savedEntry = readJson<POAEntry>(poaKey(dailyPracticeId));
  if (savedEntry) return savedEntry;

  const localDate = localDateFromDailyPracticeId(dailyPracticeId);
  if (!localDate) return null;

  return getTodayPractice(localDate)?.poaEntry ?? null;
}

export function clearTodayPracticePreview(localDate = getLocalDate()): void {
  const storage = getStorage();
  if (!storage) return;

  const existing = getTodayPractice(localDate);
  if (existing?.status === 'started') return;

  storage.removeItem(dailyPracticeKey(localDate));
}

export function savePOA(entry: Omit<POAEntry, 'updatedAt'>): POAEntry {
  const savedEntry: POAEntry = {
    ...entry,
    updatedAt: new Date().toISOString(),
  };

  writeJson(poaKey(entry.dailyPracticeId), savedEntry);
  attachPOAToDailyPractice(savedEntry);

  return savedEntry;
}

export function resetTodayPracticeForLocalDemo(localDate = getLocalDate()): void {
  const storage = getStorage();
  if (!storage) return;

  const existing = getTodayPractice(localDate);
  if (existing) {
    storage.removeItem(poaKey(existing.id));
  }
  storage.removeItem(dailyPracticeKey(localDate));
}

function dailyPracticeKey(localDate: string): string {
  return `${scopedPrefix()}daily-practice:${localDate}`;
}

function poaKey(dailyPracticeId: string): string {
  return `${scopedPrefix()}poa:${dailyPracticeId}`;
}

function attachPOAToDailyPractice(entry: POAEntry): void {
  const localDate = localDateFromDailyPracticeId(entry.dailyPracticeId);
  if (!localDate) return;

  const practice = getTodayPractice(localDate);
  if (!practice || practice.id !== entry.dailyPracticeId) return;

  writeJson(dailyPracticeKey(localDate), {
    ...practice,
    poaEntry: entry,
    updatedAt: entry.updatedAt,
  });
}

function localDateFromDailyPracticeId(dailyPracticeId: string): string | null {
  const prefix = 'daily-practice:';
  if (!dailyPracticeId.startsWith(prefix)) return null;

  return dailyPracticeId.slice(prefix.length);
}

function readJson<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.warn(`Unable to read local practice state for ${key}`, error);
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(key, JSON.stringify(value));
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  return window.localStorage;
}
