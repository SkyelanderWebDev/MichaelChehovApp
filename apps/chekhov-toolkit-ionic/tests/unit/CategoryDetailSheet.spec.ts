import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import CategoryDetailSheet from '@/components/CategoryDetailSheet.vue'
import { getToolCatalogCategory } from '@/data/toolCatalog'

const EXPANDING = getToolCatalogCategory('expanding-contracting')!

function childrenByTool(pick: (toolName: string, all: string[]) => string[]): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const tool of EXPANDING.tools) {
    map[tool.name] = pick(tool.name, [...tool.children])
  }
  return map
}

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

  test('per-category examples toggle label is tri-state (all / some / none)', () => {
    const allWrapper = mountSheet({
      selectionContext: 'chart',
      selectedChildrenByTool: childrenByTool((_name, all) => all),
    })
    expect(allWrapper.find('.toggle-all-examples').text()).toBe('All examples')

    const noneWrapper = mountSheet({
      selectionContext: 'chart',
      selectedChildrenByTool: childrenByTool(() => []),
    })
    expect(noneWrapper.find('.toggle-all-examples').text()).toBe('No examples')

    // Only the first tool keeps its labels -> partial selection must read "Some examples".
    const firstTool = EXPANDING.tools[0].name
    const mixedWrapper = mountSheet({
      selectionContext: 'chart',
      selectedChildrenByTool: childrenByTool((name, all) => (name === firstTool ? all : [])),
    })
    const mixedLabel = mixedWrapper.find('.toggle-all-examples').text()
    expect(mixedLabel).toBe('Some examples')
    expect(mixedLabel).not.toBe('All examples')
  })

  test('keeps browse mode child labels as read-only chips by default', () => {
    const wrapper = mountSheet({ browse: true })

    expect(wrapper.findAll('[data-testid="child-selector"]')).toHaveLength(0)
    expect(wrapper.findAll('.child-chip').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Browse this chart area here')
  })
})
