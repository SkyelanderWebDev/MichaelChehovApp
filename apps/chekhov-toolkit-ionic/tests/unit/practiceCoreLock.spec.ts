import { beforeEach, describe, expect, test, vi } from 'vitest'

// In-memory Supabase double so the completed-state lock guards are exercised
// without a live backend. Seeded fresh per test; mutation ops are counted so we
// can assert "no write happened" on a locked day.
const state = vi.hoisted(() => {
  const dailyPractices: Record<string, unknown>[] = []
  const poaEntries: Record<string, unknown>[] = []
  const calls = { upsert: 0, update: 0, insert: 0 }

  function matches(row: Record<string, unknown>, filters: Record<string, unknown>): boolean {
    return Object.entries(filters).every(([key, value]) => row[key] === value)
  }

  function makeBuilder(table: string) {
    let op = 'select'
    const filters: Record<string, unknown> = {}
    let payload: Record<string, unknown> | null = null

    const result = () => {
      if (op === 'upsert') {
        calls.upsert += 1
        const row = { ...payload, updated_at: '2026-06-24T15:00:00.000Z' }
        return { data: row, error: null }
      }
      if (op === 'update') {
        calls.update += 1
        const row = table === 'daily_practices' ? dailyPractices.find((r) => matches(r, filters)) : null
        return { data: { ...row, ...payload }, error: null }
      }
      if (op === 'insert') {
        calls.insert += 1
        const row = { id: 'note-generated', created_at: '2026-06-24T16:00:00.000Z', ...payload }
        return { data: row, error: null }
      }
      const source = table === 'daily_practices' ? dailyPractices : poaEntries
      return { data: source.find((r) => matches(r, filters)) ?? null, error: null }
    }

    const builder: Record<string, unknown> = {
      select: () => builder,
      insert: (p: Record<string, unknown>) => {
        op = 'insert'
        payload = p
        return builder
      },
      upsert: (p: Record<string, unknown>) => {
        op = 'upsert'
        payload = p
        return builder
      },
      update: (p: Record<string, unknown>) => {
        op = 'update'
        payload = p
        return builder
      },
      delete: () => {
        op = 'delete'
        return builder
      },
      eq: (col: string, val: unknown) => {
        filters[col] = val
        return builder
      },
      order: () => builder,
      maybeSingle: () => Promise.resolve(result()),
      single: () => Promise.resolve(result()),
    }
    return builder
  }

  const client = { from: (table: string) => makeBuilder(table) }

  return { dailyPractices, poaEntries, calls, client }
})

vi.mock('@/lib/supabaseClient', () => ({
  isSupabaseConfigured: true,
  supabase: { auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } }, error: null }) } },
  requireSupabase: () => state.client,
}))

import { addPOANote, savePOA, unlockTodayPractice } from '@/stores/dailyPracticeStore'

function seedCompletedDay() {
  state.dailyPractices.push({
    id: 'dp-completed',
    user_id: 'u1',
    local_date: '2026-06-20',
    source: 'random',
    status: 'completed',
    selected_tool: { categoryId: 'truth', categoryName: 'Truth', parentToolName: 'Sense of Truth' },
    started_at: '2026-06-20T08:00:00.000Z',
    completed_at: '2026-06-20T20:00:00.000Z',
    flyback_note: null,
    updated_at: '2026-06-20T20:00:00.000Z',
  })
  state.poaEntries.push({
    daily_practice_id: 'dp-completed',
    user_id: 'u1',
    mode: 'journal',
    practice_notes: '',
    observe_morning: '',
    observe_midday: '',
    observe_evening: '',
    apply_morning: '',
    apply_midday: '',
    apply_evening: '',
    journal_text: 'Locked note — must not change.',
    updated_at: '2026-06-20T19:00:00.000Z',
  })
}

function seedStartedDay() {
  state.dailyPractices.push({
    id: 'dp-started',
    user_id: 'u1',
    local_date: '2026-06-24',
    source: 'random',
    status: 'started',
    selected_tool: { categoryId: 'truth', categoryName: 'Truth', parentToolName: 'Sense of Truth' },
    started_at: '2026-06-24T08:00:00.000Z',
    completed_at: null,
    flyback_note: null,
    updated_at: '2026-06-24T08:00:00.000Z',
  })
}

beforeEach(() => {
  state.dailyPractices.length = 0
  state.poaEntries.length = 0
  state.calls.upsert = 0
  state.calls.update = 0
  state.calls.insert = 0
})

describe('completed-day lock enforcement (store guards)', () => {
  test('savePOA refuses to overwrite a completed day and returns the persisted entry', async () => {
    seedCompletedDay()

    const result = await savePOA({
      dailyPracticeId: 'dp-completed',
      mode: 'journal',
      practiceNotes: '',
      observeMorning: '',
      observeMidday: '',
      observeEvening: '',
      applyMorning: '',
      applyMidday: '',
      applyEvening: '',
      journalText: 'Attempted overwrite after lock.',
    })

    expect(state.calls.upsert).toBe(0)
    expect(result?.journalText).toBe('Locked note — must not change.')
  })

  test('unlockTodayPractice leaves a completed day locked', async () => {
    seedCompletedDay()

    const result = await unlockTodayPractice('2026-06-20')

    expect(state.calls.update).toBe(0)
    expect(result?.status).toBe('completed')
  })

  test('addPOANote is rejected before the day is completed', async () => {
    seedStartedDay()

    const result = await addPOANote('dp-started', 'Too early to append.')

    expect(result).toBeNull()
    expect(state.calls.insert).toBe(0)
  })

  test('addPOANote appends once the day is completed', async () => {
    seedCompletedDay()

    const result = await addPOANote('dp-completed', 'A reflection after lock.')

    expect(state.calls.insert).toBe(1)
    expect(result?.note).toBe('A reflection after lock.')
  })
})
