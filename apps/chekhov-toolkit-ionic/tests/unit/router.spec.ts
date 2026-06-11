import { describe, expect, it } from 'vitest';
import router from '@/router';

describe('app shell routing', () => {
  it('redirects / to /chart', async () => {
    await router.push('/');
    expect(router.currentRoute.value.path).toBe('/chart');
  });

  it('redirects legacy /home to /chart', async () => {
    await router.push('/home');
    expect(router.currentRoute.value.path).toBe('/chart');
  });

  it('resolves every bottom tab route', async () => {
    for (const path of ['/library', '/journal', '/chart', '/map', '/settings']) {
      await router.push(path);
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.matched.length).toBeGreaterThan(0);
    }
  });
});
