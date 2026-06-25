import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  createAllChildToolFilter,
  createEmptyChildToolFilter,
} from '@/data/toolCatalog'

// Keep the pages signed-out and offline so onMounted does no Supabase work; the
// pool/directory panels (and their examples toggles) still render.
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ query: {}, params: {} }),
}))

vi.mock('@/stores/authStore', async () => {
  const { ref } = await import('vue')
  return {
    authStatus: ref('signed-out'),
    currentUser: ref(null),
    loadSession: vi.fn(async () => {}),
  }
})

const passthrough = (tag = 'div') => ({ template: `<${tag}><slot /></${tag}>` })

const stubs = {
  IonPage: passthrough(),
  IonContent: passthrough(),
  IonSegment: passthrough(),
  IonSegmentButton: passthrough(),
  IonLabel: passthrough('span'),
  IonIcon: passthrough('span'),
  IonToggle: passthrough('span'),
  IonButton: { template: '<button type="button"><slot /></button>' },
  CircleChart: true,
  TopStatusBar: true,
  CategoryDetailSheet: true,
  PracticeHistoryList: true,
  DailyActionCard: true,
  PracticeRouteCard: true,
  TesterAccessSheet: true,
  ToolPreviewCard: true,
}

async function mountPage(component: unknown) {
  const wrapper = mount(component as never, { global: { stubs } })
  await flushPromises()
  await nextTick()
  return wrapper
}

async function setChildFilter(wrapper: Awaited<ReturnType<typeof mountPage>>, filter: unknown) {
  const vm = wrapper.vm as unknown as { selectedChildTools: unknown }
  vm.selectedChildTools = filter
  await nextTick()
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('global examples toggle label is tri-state on the pages', () => {
  test('ChartPage directory toggle: all / some / none', async () => {
    const { default: ChartPage } = await import('@/views/ChartPage.vue')
    const wrapper = await mountPage(ChartPage)
    const label = () => wrapper.get('[data-testid="chart-examples-toggle"]').text()

    // Initialized to all examples selected.
    expect(label()).toBe('All examples')

    const mixed = createAllChildToolFilter()
    mixed['four-brothers'].Beauty = []
    await setChildFilter(wrapper, mixed)
    expect(label()).toBe('Some examples')

    await setChildFilter(wrapper, createEmptyChildToolFilter())
    expect(label()).toBe('No examples')

    await setChildFilter(wrapper, createAllChildToolFilter())
    expect(label()).toBe('All examples')
  })

  test('JournalPage pool toggle: all / some / none', async () => {
    const { default: JournalPage } = await import('@/views/JournalPage.vue')
    const wrapper = await mountPage(JournalPage)
    const label = () => wrapper.get('[data-testid="journal-examples-toggle"]').text()

    expect(label()).toBe('All examples')

    const mixed = createAllChildToolFilter()
    mixed['four-brothers'].Beauty = []
    await setChildFilter(wrapper, mixed)
    expect(label()).toBe('Some examples')

    await setChildFilter(wrapper, createEmptyChildToolFilter())
    expect(label()).toBe('No examples')
  })
})
