import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import CategoryDetailSheet from '@/components/CategoryDetailSheet.vue'

const ionicStubs = {
  IonButton: { template: '<button type="button" @click="$emit(\'click\')"><slot /></button>' },
  IonContent: { template: '<div><slot /></div>' },
  IonFooter: { template: '<footer><slot /></footer>' },
  IonModal: { template: '<div><slot /></div>' },
  IonToggle: {
    props: ['checked', 'disabled'],
    template: `
      <label>
        <input
          type="checkbox"
          :checked="checked"
          :disabled="disabled"
          @change="$emit('ionChange', { detail: { checked: $event.target.checked } })"
        />
        <slot />
      </label>
    `,
  },
  IonCheckbox: {
    props: ['checked', 'disabled'],
    template: `
      <label>
        <input
          type="checkbox"
          :checked="checked"
          :disabled="disabled"
          @change="$emit('ionChange', { detail: { checked: $event.target.checked } })"
        />
        <slot />
      </label>
    `,
  },
}

function mountSheet(extraProps = {}) {
  return mount(CategoryDetailSheet, {
    props: {
      isOpen: true,
      categoryId: 'expanding-contracting',
      included: true,
      selectedToolNames: ['Expanding'],
      locked: false,
      ...extraProps,
    },
    global: { stubs: ionicStubs },
  })
}

describe('CategoryDetailSheet child selection mode', () => {
  test('renders child checkbox chips and emits child selection updates when configured', async () => {
    const wrapper = mountSheet({
      selectionContext: 'chart',
      selectedChildrenByTool: {
        Expanding: ['Opening'],
      },
    })

    expect(wrapper.text()).toContain('Include in Quick Draw pool')
    expect(wrapper.findAll('[data-testid="child-selector"]').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.child-chip')).toHaveLength(0)

    await wrapper.find('[data-child-name="Growing"] input').setValue(true)

    expect(wrapper.emitted('set-selected-children')?.[0]).toEqual([
      'expanding-contracting',
      'Expanding',
      ['Opening', 'Growing'],
    ])
  })

  test('keeps browse mode child labels as read-only chips by default', () => {
    const wrapper = mountSheet({ browse: true })

    expect(wrapper.findAll('[data-testid="child-selector"]')).toHaveLength(0)
    expect(wrapper.findAll('.child-chip').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Browse this chart area here')
  })
})
