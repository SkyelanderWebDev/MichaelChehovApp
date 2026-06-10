import { computed, ref } from 'vue';

// Local demo auth client. Talks to the root Express/SQLite server through the
// Vite dev proxy (`/api`). Sessions live in an httpOnly cookie, so this store
// never sees or stores passwords/tokens beyond the form submission itself.
// If the auth server is unreachable, the app stays fully usable as a guest.

export interface AuthUser {
  id: string;
  username: string;
  createdAt?: string;
}

export type AuthStatus = 'unknown' | 'guest' | 'signed-in' | 'offline';

const currentUserRef = ref<AuthUser | null>(null);
const statusRef = ref<AuthStatus>('unknown');
const lastErrorRef = ref<string | null>(null);
const busyRef = ref(false);

export const currentUser = computed(() => currentUserRef.value);
export const authStatus = computed(() => statusRef.value);
export const authError = computed(() => lastErrorRef.value);
export const authBusy = computed(() => busyRef.value);

async function postJson(path: string, body?: unknown): Promise<Response> {
  return fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function loadSession(): Promise<void> {
  try {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Unexpected status ${response.status}`);

    const data = (await response.json()) as { user: AuthUser | null };
    currentUserRef.value = data.user;
    statusRef.value = data.user ? 'signed-in' : 'guest';
  } catch {
    currentUserRef.value = null;
    statusRef.value = 'offline';
  }
}

async function submitCredentials(path: string, username: string, password: string): Promise<boolean> {
  busyRef.value = true;
  lastErrorRef.value = null;

  try {
    const response = await postJson(path, { username, password });
    const data = (await response.json().catch(() => ({}))) as { user?: AuthUser; error?: string };

    if (!response.ok || !data.user) {
      lastErrorRef.value = data.error ?? 'Something went wrong. Try again.';
      return false;
    }

    currentUserRef.value = data.user;
    statusRef.value = 'signed-in';
    return true;
  } catch {
    statusRef.value = 'offline';
    lastErrorRef.value = 'Local demo auth server is not reachable.';
    return false;
  } finally {
    busyRef.value = false;
  }
}

export function signUp(username: string, password: string): Promise<boolean> {
  return submitCredentials('/api/auth/signup', username, password);
}

export function signIn(username: string, password: string): Promise<boolean> {
  return submitCredentials('/api/auth/signin', username, password);
}

export async function signOut(): Promise<void> {
  busyRef.value = true;
  lastErrorRef.value = null;

  try {
    await postJson('/api/auth/signout');
  } catch {
    // Even if the server is unreachable, drop the local signed-in state.
  } finally {
    currentUserRef.value = null;
    statusRef.value = 'guest';
    busyRef.value = false;
  }
}
