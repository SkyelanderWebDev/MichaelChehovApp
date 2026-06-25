import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearQuickDrawHistory,
  getQuickDrawHistory,
  loadQuickDrawHistory,
  logQuickDraw,
} from '@/stores/quickDrawHistoryStore';
import type { PracticeToolSelection } from '@/types/practice';

const STORAGE_KEY = 'mct-wave1:chart-quick-draws';

function selection(parentToolName: string, categoryId = 'expanding-contracting'): PracticeToolSelection {
  return {
    categoryId,
    categoryName: 'Expanding & Contracting',
    parentToolName,
  };
}

describe('chart Quick-Draw history store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    loadQuickDrawHistory();
  });

  it('starts empty', () => {
    expect(getQuickDrawHistory()).toEqual([]);
  });

  it('logs a chart draw and exposes it newest-first', () => {
    logQuickDraw(selection('Expanding'));
    logQuickDraw(selection('Contracting'));

    const history = getQuickDrawHistory();
    expect(history).toHaveLength(2);
    expect(history[0].selectedTool.parentToolName).toBe('Contracting');
    expect(history[1].selectedTool.parentToolName).toBe('Expanding');
    expect(typeof history[0].id).toBe('string');
    expect(typeof history[0].drawnAt).toBe('string');
  });

  it('persists across a reload from localStorage', () => {
    logQuickDraw(selection('Expanding'));
    const persisted = window.localStorage.getItem(STORAGE_KEY);
    expect(persisted).toBeTruthy();

    // Simulate a fresh page load with the same storage.
    loadQuickDrawHistory();
    expect(getQuickDrawHistory()).toHaveLength(1);
  });

  it('clears the log without touching anything else', () => {
    logQuickDraw(selection('Expanding'));
    clearQuickDrawHistory();
    expect(getQuickDrawHistory()).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('[]');
  });

  it('does not write to the Supabase practice draw_history key', () => {
    logQuickDraw(selection('Expanding'));
    // Only the dedicated, device-local key is ever used.
    expect(Object.keys(window.localStorage)).toEqual([STORAGE_KEY]);
  });
});
