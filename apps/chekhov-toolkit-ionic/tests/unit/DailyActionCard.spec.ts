import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import DailyActionCard from '@/components/DailyActionCard.vue'
import type { POADraft, POAEntry, POANote } from '@/types/practice'

const ionicStubs = {
  IonCard: { template: '<div><slot /></div>' },
  IonCardHeader: { template: '<div><slot /></div>' },
  IonCardContent: { template: '<div><slot /></div>' },
  IonButton: {
    template:
      '<button type="button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    props: ['disabled'],
  },
}

function mountCard(props: Record<string, unknown> = {}) {
  return mount(DailyActionCard, {
    props: { entry: null, ...props },
    global: { stubs: ionicStubs },
  })
}

const COMPLETED_ENTRY: POAEntry = {
  dailyPracticeId: '00000000-0000-0000-0000-000000000000',
  mode: 'journal',
  practiceNotes: '',
  observeMorning: '',
  observeMidday: '',
  observeEvening: '',
  applyMorning: '',
  applyMidday: '',
  applyEvening: '',
  journalText: 'Locked free response note.',
  updatedAt: '2026-06-24T12:00:00.000Z',
}

const NOTES: POANote[] = [
  {
    id: 'note-1',
    dailyPracticeId: COMPLETED_ENTRY.dailyPracticeId,
    note: 'A reflection added after completion.',
    createdAt: '2026-06-24T13:00:00.000Z',
  },
]

describe('DailyActionCard POA draft contract', () => {
  test('emits the structured POA fields as a single draft payload', async () => {
    const wrapper = mountCard()

    expect(wrapper.find('.mode-control button.active').text()).toBe('Structured')
    await wrapper.find('#poa-practice').setValue('Practice the selected tool before rehearsal.')
    await wrapper.find('#poa-observe-morning').setValue('Noticed the morning impulse.')
    await wrapper.find('#poa-apply-evening').setValue('Applied the evening adjustment.')

    await wrapper.find('.daily-action-footer button').trigger('click')

    const payload = wrapper.emitted('save')?.[0]?.[0] as POADraft | undefined
    expect(payload).toMatchObject({
      mode: 'structured',
      practiceNotes: 'Practice the selected tool before rehearsal.',
      observeMorning: 'Noticed the morning impulse.',
      observeMidday: '',
      observeEvening: '',
      applyMorning: '',
      applyMidday: '',
      applyEvening: 'Applied the evening adjustment.',
      journalText: '',
    })
  })

  test('emits the free-response POA field without dropping the mode', async () => {
    const wrapper = mountCard()

    await wrapper.findAll('.mode-control button')[1].trigger('click')
    await wrapper.find('#daily-action-note').setValue('Free response POA note for this practice.')
    await wrapper.find('.daily-action-footer button').trigger('click')

    const payload = wrapper.emitted('save')?.[0]?.[0] as POADraft | undefined
    expect(payload).toMatchObject({
      mode: 'journal',
      practiceNotes: '',
      observeMorning: '',
      observeMidday: '',
      observeEvening: '',
      applyMorning: '',
      applyMidday: '',
      applyEvening: '',
      journalText: 'Free response POA note for this practice.',
    })
  })

  test('emits complete with the current draft so a mid-typing tap is not lost', async () => {
    const wrapper = mountCard()

    // Type but do NOT click Save — the Complete tap must flush this draft.
    await wrapper.find('#poa-practice').setValue('Last edit before completing.')

    const completeButton = wrapper
      .findAll('.daily-action-footer button')
      .find((button) => button.text() === 'Complete Practice')

    expect(completeButton).toBeTruthy()
    await completeButton!.trigger('click')

    const payload = wrapper.emitted('complete')?.[0]?.[0] as POADraft | undefined
    expect(payload?.practiceNotes).toBe('Last edit before completing.')
  })
})

describe('DailyActionCard locked / post-lock behaviour', () => {
  test('renders POA read-only and surfaces post-lock notes when locked', () => {
    const wrapper = mountCard({ entry: COMPLETED_ENTRY, readonly: true, notes: NOTES })

    expect(wrapper.find('#daily-action-note').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.mode-control button').attributes('disabled')).toBeDefined()
    // The editable Save/Complete footer is hidden once locked.
    expect(wrapper.find('.daily-action-footer button').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Save Daily Action')
    expect(wrapper.text()).toContain('A reflection added after completion.')
  })

  test('emits add-note with the trimmed note text', async () => {
    const wrapper = mountCard({ entry: COMPLETED_ENTRY, readonly: true, notes: NOTES })

    await wrapper.find('#post-lock-note-input').setValue('  Later that evening.  ')
    const addButton = wrapper
      .find('.post-lock-notes')
      .findAll('button')
      .find((button) => button.text() === 'Add note')
    await addButton!.trigger('click')

    expect(wrapper.emitted('add-note')?.[0]?.[0]).toBe('Later that evening.')
  })
})

describe('DailyActionCard autosave', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('debounces edits into a single autosave payload before lock', async () => {
    vi.useFakeTimers()
    const wrapper = mountCard()

    await wrapper.find('#poa-practice').setValue('Drafting before a reload.')
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()

    const payload = wrapper.emitted('autosave')?.[0]?.[0] as POADraft | undefined
    expect(payload?.practiceNotes).toBe('Drafting before a reload.')
  })

  test('does not autosave once the practice is locked', async () => {
    vi.useFakeTimers()
    const wrapper = mountCard({ entry: COMPLETED_ENTRY, readonly: true, notes: NOTES })

    await wrapper.find('#post-lock-note-input').setValue('Typing a note, not a draft.')
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('autosave')).toBeUndefined()
  })
})
