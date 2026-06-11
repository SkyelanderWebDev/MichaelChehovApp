import { computed, ref } from 'vue';

export type AppearancePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const APPEARANCE_STORAGE_KEY = 'mct-appearance';

const THEME_COLORS: Record<ResolvedTheme, string> = {
  dark: '#12100e',
  light: '#fffdf8',
};

const appearanceRef = ref<AppearancePreference>('system');
const resolvedThemeRef = ref<ResolvedTheme>('dark');
let systemListenerStarted = false;

export const appearance = computed(() => appearanceRef.value);
export const resolvedTheme = computed(() => resolvedThemeRef.value);

export function readStoredAppearance(): AppearancePreference {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Storage unavailable (private mode, SSR test env): fall through to system.
  }
  return 'system';
}

export function resolveTheme(preference: AppearancePreference): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemPrefersDark() ? 'dark' : 'light';
}

export function setAppearance(preference: AppearancePreference): void {
  appearanceRef.value = preference;

  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, preference);
  } catch {
    // Persisting is best-effort; the in-memory preference still applies.
  }

  applyResolvedTheme(resolveTheme(preference));
}

export function initTheme(): void {
  appearanceRef.value = readStoredAppearance();
  applyResolvedTheme(resolveTheme(appearanceRef.value));
  startSystemListener();
}

function applyResolvedTheme(theme: ResolvedTheme): void {
  resolvedThemeRef.value = theme;

  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', THEME_COLORS[theme]);
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function startSystemListener(): void {
  if (systemListenerStarted) return;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (appearanceRef.value === 'system') {
      applyResolvedTheme(resolveTheme('system'));
    }
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onChange);
  }

  systemListenerStarted = true;
}
