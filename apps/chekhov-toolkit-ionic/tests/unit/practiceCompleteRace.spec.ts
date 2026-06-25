import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import DailyActionCard from '@/components/DailyActionCard.vue'
import JournalPage from '@/views/JournalPage.vue'
import type { POADraft } from '@/types/practice'
import * as store from '@/stores/dailyPracticeStore'

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/stores/authStore', async () => {
  const { ref } = await import('vue')
  return {
    authStatus: ref('signed-in'),
    currentUser: ref({ id: 'u1', email: 'tester@example.com' }),
    loadSession: vi.fn().mockResolvedValue(undefined),
  }
})

vi.mock('@/stores/dailyPracticeStore', () => ({
  getLocalDate: vi.fn(() => '2026-06-24'),
  getTodayPractice: vi.fn(),
  getPOA: vi.fn(),
  getPOANotes: vi.fn(),
  setPreview: vi.fn(),
  startTodayPractice: vi.fn(),
  unlockTodayPractice: vi.fn(),
  completeTodayPractice: vi.fn(),
  savePOA: vi.fn(),
  saveFlybackNote: vi.fn(),
  addPOANote: vi.fn(),
  clearTodayPracticePreview: vi.fn(),
}))

const STARTED_PRACTICE = {
  id: 'dp1',
  localDate: '2026-06-24',
  source: 'random' as const,
  status: 'started' as const,
  selectedTool: { categoryId: 'truth', categoryName: 'Truth', parentToolName: 'Sense of Truth' },
  updatedAt: 't0',
}

function draft(journalText: string): POADraft {
  return {
    mode: 'journal',
    practiceNotes: '',
    observeMorning: '',
    observeMidday: '',
    observeEvening: '',
    applyMorning: '',
    applyMidday: '',
    applyEvening: '',
    journalText,
  }
}

const stubs = {
  CategoryDetailSheet: true,
  PracticeRouteCard: true,
  TesterAccessSheet: true,
  ToolPreviewCard: true,
  DailyActionCard: true,
  IonButton: true,
  IonContent: { template: '<div><slot /></div>' },
  IonPage: { template: '<div><slot /></div>' },
}

beforeEach(() => {
  // Reset call history/order between tests (keeps factory implementations).
  vi.clearAllMocks()
  vi.mocked(store.getLocalDate).mockReturnValue('2026-06-24')
  vi.mocked(store.getTodayPractice).mockResolvedValue({ ...STARTED_PRACTICE })
  vi.mocked(store.getPOA).mockResolvedValue(null)
  vi.mocked(store.getPOANotes).mockResolvedValue([])
  vi.mocked(store.completeTodayPractice).mockResolvedValue({
    ...STARTED_PRACTICE,
    status: 'completed',
    completedAt: 't1',
  })
})

describe('Complete vs in-flight autosave race', () => {
  test('a late autosave cannot clobber the draft persisted by Complete', async () => {
    const landed: string[] = []
    let resolveAutosave: (() => void) | null = null

    vi.mocked(store.savePOA).mockImplementation((entry) => {
      if (entry.journalText === 'AUTOSAVE') {
        // Hold the autosave write open to model an in-flight save.
        return new Promise((resolve) => {
          resolveAutosave = () => {
            landed.push('AUTOSAVE')
            resolve({ ...entry, updatedAt: 'ta' })
          }
        })
      }
      landed.push(entry.journalText)
      return Promise.resolve({ ...entry, updatedAt: 'tc' })
    })

    const wrapper = mount(JournalPage, { global: { stubs } })
    await flushPromises()

    const card = wrapper.findComponent(DailyActionCard)
    expect(card.exists()).toBe(true)

    // Autosave fires (in flight, unresolved), then Complete is tapped mid-typing.
    card.vm.$emit('autosave', draft('AUTOSAVE'))
    await Promise.resolve()
    card.vm.$emit('complete', draft('COMPLETE'))
    await Promise.resolve()

    // Complete must be waiting on the drained autosave — no write has landed yet.
    expect(landed).toEqual([])

    resolveAutosave?.()
    await flushPromises()

    // Autosave landed first, then the explicit Complete save; Complete wins.
    expect(landed).toEqual(['AUTOSAVE', 'COMPLETE'])
    expect(store.savePOA).toHaveBeenCalledTimes(2)
    expect(store.completeTodayPractice).toHaveBeenCalledTimes(1)

    // No write lands after the day is completed.
    const lastSaveOrder = vi.mocked(store.savePOA).mock.invocationCallOrder.at(-1) ?? 0
    const completeOrder = vi.mocked(store.completeTodayPractice).mock.invocationCallOrder[0]
    expect(completeOrder).toBeGreaterThan(lastSaveOrder)
  })

  test('two overlapping autosaves are serialized and cannot land after Complete', async () => {
    const landed: string[] = []
    let resolveA: (() => void) | null = null

    vi.mocked(store.savePOA).mockImplementation((entry) => {
      if (entry.journalText === 'A') {
        // First autosave held open; the second must queue behind it.
        return new Promise((resolve) => {
          resolveA = () => {
            landed.push('A')
            resolve({ ...entry, updatedAt: 'ta' })
          }
        })
      }
      landed.push(entry.journalText)
      return Promise.resolve({ ...entry, updatedAt: 'tx' })
    })

    const wrapper = mount(JournalPage, { global: { stubs } })
    await flushPromises()

    const card = wrapper.findComponent(DailyActionCard)

    // Two autosaves submitted while A is still in flight, then Complete tapped.
    card.vm.$emit('autosave', draft('A'))
    await Promise.resolve()
    card.vm.$emit('autosave', draft('B'))
    await Promise.resolve()
    card.vm.$emit('complete', draft('COMPLETE'))
    await Promise.resolve()

    // Nothing has landed: A is in flight, B is queued behind it, Complete drains.
    expect(landed).toEqual([])

    resolveA?.()
    await flushPromises()

    // Strict order: A, then B (serialized), then the Complete-save last.
    expect(landed).toEqual(['A', 'B', 'COMPLETE'])
    expect(landed.at(-1)).toBe('COMPLETE')
    expect(store.completeTodayPractice).toHaveBeenCalledTimes(1)

    // Every POA write is ordered before completion — none resolves afterwards.
    const lastSaveOrder = vi.mocked(store.savePOA).mock.invocationCallOrder.at(-1) ?? 0
    const completeOrder = vi.mocked(store.completeTodayPractice).mock.invocationCallOrder[0]
    expect(completeOrder).toBeGreaterThan(lastSaveOrder)
  })
})
