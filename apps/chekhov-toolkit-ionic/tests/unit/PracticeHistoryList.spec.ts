import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { computed, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PracticeHistoryDay } from '@/types/practice';

const authStatusRef = ref('signed-in');
const currentUserRef = ref<{ id: string; email: string } | null>({ id: 'tester-1', email: 't@example.com' });

vi.mock('@/stores/authStore', () => ({
  authStatus: computed(() => authStatusRef.value),
  currentUser: computed(() => currentUserRef.value),
  loadSession: vi.fn().mockResolvedValue(undefined),
}));

const getPracticeHistory = vi.fn();
vi.mock('@/stores/dailyPracticeStore', () => ({
  getPracticeHistory: () => getPracticeHistory(),
}));

import PracticeHistoryList from '@/components/PracticeHistoryList.vue';

function completedDay(): PracticeHistoryDay {
  return {
    practice: {
      id: 'day-1',
      localDate: '2026-06-23',
      source: 'random',
      status: 'completed',
      selectedTool: {
        categoryId: 'expanding-contracting',
        categoryName: 'Expanding & Contracting',
        parentToolName: 'Expanding',
      },
      updatedAt: '2026-06-23T12:00:00.000Z',
    },
    poa: {
      dailyPracticeId: 'day-1',
      mode: 'structured',
      practiceNotes: 'Opened the chest on a slow breath.',
      observeMorning: '',
      observeMidday: '',
      observeEvening: '',
      applyMorning: '',
      applyMidday: '',
      applyEvening: '',
      journalText: '',
      updatedAt: '2026-06-23T12:00:00.000Z',
    },
    draws: [],
    notes: [],
  };
}

describe('PracticeHistoryList (Journal History segment)', () => {
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    getPracticeHistory.mockReset();
    getPracticeHistory.mockResolvedValue([]);
    authStatusRef.value = 'signed-in';
    currentUserRef.value = { id: 'tester-1', email: 't@example.com' };
  });

  afterEach(() => {
    // Unmount so a stale component's currentUser watcher can't re-run against the
    // next test's reset mock.
    wrapper?.unmount();
    wrapper = null;
  });

  it('renders a past locked practice day read-only (no editable inputs)', async () => {
    getPracticeHistory.mockResolvedValue([completedDay()]);

    wrapper = mount(PracticeHistoryList);
    await flushPromises();

    expect(wrapper.text()).toContain('Expanding');
    expect(wrapper.text()).toContain('Completed');
    expect(wrapper.text()).toContain('Opened the chest on a slow breath.');

    // Read-only: history must not expose any editable POA fields.
    expect(wrapper.findAll('textarea')).toHaveLength(0);
    expect(wrapper.findAll('input')).toHaveLength(0);
  });

  it('shows the tester-access gate when signed out', async () => {
    authStatusRef.value = 'guest';
    currentUserRef.value = null;

    wrapper = mount(PracticeHistoryList);
    await flushPromises();

    expect(wrapper.text()).toContain('Tester access');
    expect(getPracticeHistory).not.toHaveBeenCalled();
  });
});
