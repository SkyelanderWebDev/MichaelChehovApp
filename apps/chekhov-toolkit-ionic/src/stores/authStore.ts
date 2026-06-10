import { computed, ref } from 'vue';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string | null;
  createdAt?: string;
}

export type AuthStatus = 'unknown' | 'guest' | 'signed-in' | 'misconfigured' | 'error';

const currentUserRef = ref<AuthUser | null>(null);
const statusRef = ref<AuthStatus>('unknown');
const lastErrorRef = ref<string | null>(null);
const busyRef = ref(false);
let authSubscriptionStarted = false;

export const currentUser = computed(() => currentUserRef.value);
export const authStatus = computed(() => statusRef.value);
export const authError = computed(() => lastErrorRef.value);
export const authBusy = computed(() => busyRef.value);
export const authConfigured = computed(() => isSupabaseConfigured);

export async function loadSession(): Promise<void> {
  if (!supabase) {
    currentUserRef.value = null;
    statusRef.value = 'misconfigured';
    lastErrorRef.value = 'Supabase is not configured for this build.';
    return;
  }

  startAuthSubscription();

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    currentUserRef.value = data.session?.user ? mapSupabaseUser(data.session.user) : null;
    statusRef.value = currentUserRef.value ? 'signed-in' : 'guest';
    lastErrorRef.value = null;
  } catch {
    currentUserRef.value = null;
    statusRef.value = 'error';
    lastErrorRef.value = 'Unable to restore the Supabase session.';
  }
}

export async function signUp(email: string, password: string): Promise<boolean> {
  if (!supabase) {
    statusRef.value = 'misconfigured';
    lastErrorRef.value = 'Supabase URL and anon key are required before beta accounts can be created.';
    return false;
  }

  busyRef.value = true;
  lastErrorRef.value = null;

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          display_name: normalizedEmail.split('@')[0],
        },
      },
    });

    if (error) {
      lastErrorRef.value = error.message;
      return false;
    }

    if (!data.session?.user) {
      currentUserRef.value = null;
      statusRef.value = 'guest';
      lastErrorRef.value = 'Account created. Check email confirmation settings before signing in.';
      return false;
    }

    currentUserRef.value = mapSupabaseUser(data.session.user);
    statusRef.value = 'signed-in';
    return true;
  } catch {
    statusRef.value = 'error';
    lastErrorRef.value = 'Supabase sign-up failed. Check network and environment configuration.';
    return false;
  } finally {
    busyRef.value = false;
  }
}

export async function signIn(email: string, password: string): Promise<boolean> {
  if (!supabase) {
    statusRef.value = 'misconfigured';
    lastErrorRef.value = 'Supabase URL and anon key are required before beta accounts can sign in.';
    return false;
  }

  busyRef.value = true;
  lastErrorRef.value = null;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      lastErrorRef.value = error?.message ?? 'Unable to sign in.';
      return false;
    }

    currentUserRef.value = mapSupabaseUser(data.user);
    statusRef.value = 'signed-in';
    return true;
  } catch {
    statusRef.value = 'error';
    lastErrorRef.value = 'Supabase sign-in failed. Check network and environment configuration.';
    return false;
  } finally {
    busyRef.value = false;
  }
}

export async function signOut(): Promise<void> {
  busyRef.value = true;
  lastErrorRef.value = null;

  try {
    await supabase?.auth.signOut();
  } finally {
    currentUserRef.value = null;
    statusRef.value = supabase ? 'guest' : 'misconfigured';
    busyRef.value = false;
  }
}

function startAuthSubscription(): void {
  if (!supabase || authSubscriptionStarted) return;

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUserRef.value = session?.user ? mapSupabaseUser(session.user) : null;
    statusRef.value = currentUserRef.value ? 'signed-in' : 'guest';
  });

  authSubscriptionStarted = true;
}

function mapSupabaseUser(user: { id: string; email?: string; created_at?: string; user_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: typeof user.user_metadata?.display_name === 'string' ? user.user_metadata.display_name : null,
    createdAt: user.created_at,
  };
}
