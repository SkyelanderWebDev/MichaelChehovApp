// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  APPEARANCE_STORAGE_KEY,
  appearance,
  initTheme,
  readStoredAppearance,
  resolveTheme,
  setAppearance,
} from '@/stores/themeStore';

function stubLocalStorage(): Record<string, string> {
  const store: Record<string, string> = {};

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    },
  });

  return store;
}

describe('themeStore', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = stubLocalStorage();
    delete document.documentElement.dataset.theme;
  });

  it('defaults to system when nothing is stored', () => {
    expect(readStoredAppearance()).toBe('system');
  });

  it('ignores invalid stored values', () => {
    store[APPEARANCE_STORAGE_KEY] = 'neon';
    expect(readStoredAppearance()).toBe('system');
  });

  it('resolves explicit light/dark preferences directly', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('persists the preference and applies data-theme on the document', () => {
    setAppearance('dark');

    expect(store[APPEARANCE_STORAGE_KEY]).toBe('dark');
    expect(appearance.value).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');

    setAppearance('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('initTheme applies the stored preference', () => {
    store[APPEARANCE_STORAGE_KEY] = 'light';

    initTheme();

    expect(appearance.value).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
