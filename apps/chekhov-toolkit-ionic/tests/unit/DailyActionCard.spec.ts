import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import DailyActionCard from '@/components/DailyActionCard.vue'
import type { POADraft } from '@/types/practice'

const ionicStubs = {
  IonCard: { template: '<div><slot /></div>' },
  IonCardHeader: { template: '<div><slot /></div>' },
  IonCardContent: { template: '<div><slot /></div>' },
  IonButton: { template: '<button type="button" @click="$emit(\'click\')"><slot /></button>' },
}

function mountCard() {
  return mount(DailyActionCard, {
    props: { entry: null },
    global: { stubs: ionicStubs },
  })
}

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
})
