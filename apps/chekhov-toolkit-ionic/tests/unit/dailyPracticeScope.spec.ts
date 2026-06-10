import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import {
  getPOA,
  getTodayPractice,
  savePOA,
  setPracticeStorageScope,
  setPreview,
  startTodayPractice,
} from '@/stores/dailyPracticeStore'
import type { PracticeToolSelection } from '@/types/practice'

const SELECTION: PracticeToolSelection = {
  categoryId: 'four-brothers',
  categoryName: 'Four Brothers of Art',
  parentToolName: 'Ease',
  childToolName: 'Flow',
  scaleValue: null,
  unveiledValue: null,
}

// The jsdom build used by this Vitest setup does not provide a working
// localStorage, so back the store with a spec-compliant in-memory Storage.
function createMemoryStorage(): Storage {
  const items = new Map<string, string>()

  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key: string) => (items.has(key) ? items.get(key)! : null),
    key: (index: number) => [...items.keys()][index] ?? null,
    removeItem: (key: string) => {
      items.delete(key)
    },
    setItem: (key: string, value: string) => {
      items.set(key, String(value))
    },
  }
}

describe('daily practice storage scoping by local demo user', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createMemoryStorage(),
    })
  })

  beforeEach(() => {
    window.localStorage.clear()
    setPracticeStorageScope(null)
  })

  afterEach(() => {
    setPracticeStorageScope(null)
  })

  test('guest practice stays on un-scoped keys and restores after lock', () => {
    setPreview(SELECTION, 'self-selected', '2026-06-10')
    const started = startTodayPractice('2026-06-10')

    expect(started?.status).toBe('started')
    expect(window.localStorage.getItem('mct-weekend-beta:daily-practice:2026-06-10')).toBeTruthy()
    expect(getTodayPractice('2026-06-10')?.selectedTool.parentToolName).toBe('Ease')
  })

  test('signed-in users do not see guest practice and vice versa', () => {
    setPreview(SELECTION, 'self-selected', '2026-06-10')
    startTodayPractice('2026-06-10')

    setPracticeStorageScope('user-a')
    expect(getTodayPractice('2026-06-10')).toBeNull()

    setPreview({ ...SELECTION, parentToolName: 'Beauty', childToolName: 'Grace' }, 'random', '2026-06-10')
    startTodayPractice('2026-06-10')
    expect(getTodayPractice('2026-06-10')?.selectedTool.parentToolName).toBe('Beauty')
    expect(window.localStorage.getItem('mct-weekend-beta:u:user-a:daily-practice:2026-06-10')).toBeTruthy()

    setPracticeStorageScope(null)
    expect(getTodayPractice('2026-06-10')?.selectedTool.parentToolName).toBe('Ease')
  })

  test('POA notes are scoped to the active user', () => {
    setPracticeStorageScope('user-a')
    const practice = setPreview(SELECTION, 'self-selected', '2026-06-10')
    startTodayPractice('2026-06-10')
    savePOA({
      dailyPracticeId: practice.id,
      mode: 'journal',
      practiceNotes: '',
      observeMorning: '',
      observeMidday: '',
      observeEvening: '',
      applyMorning: '',
      applyMidday: '',
      applyEvening: '',
      journalText: 'User A note',
    })

    expect(getPOA(practice.id)?.journalText).toBe('User A note')

    setPracticeStorageScope('user-b')
    expect(getPOA(practice.id)).toBeNull()

    setPracticeStorageScope('user-a')
    expect(getPOA(practice.id)?.journalText).toBe('User A note')
  })
})
