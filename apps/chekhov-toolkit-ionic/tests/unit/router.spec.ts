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

  it('resolves exactly the five bottom tab routes', async () => {
    for (const path of ['/library', '/journal', '/chart', '/map', '/settings']) {
      await router.push(path);
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.name).not.toBe('NotFound');
      expect(router.currentRoute.value.matched.length).toBeGreaterThan(0);
    }
  });

  it('no longer exposes the History, Struggles, or Quiz tab routes', async () => {
    for (const path of ['/history', '/struggles', '/quiz']) {
      await router.push(path);
      // The catch-all NotFound route is retained; removed tabs fall through to it.
      expect(router.currentRoute.value.name).toBe('NotFound');
    }
  });

  it('keeps the NotFound catch-all for unknown routes', async () => {
    await router.push('/route-that-does-not-exist');
    expect(router.currentRoute.value.name).toBe('NotFound');
  });
});
