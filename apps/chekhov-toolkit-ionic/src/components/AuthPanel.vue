<template>
  <section class="auth-panel" aria-labelledby="auth-panel-title">
    <div class="auth-heading">
      <div>
        <p class="auth-kicker">Supabase Auth</p>
        <h2 id="auth-panel-title">Tester account</h2>
      </div>
      <span class="auth-status-pill" :class="`status-${authStatus}`">{{ statusLabel }}</span>
    </div>

    <template v-if="authStatus === 'signed-in' && currentUser">
      <p class="auth-copy signed-in-copy">
        Signed in as <strong class="current-username">{{ currentUser.email }}</strong>.
        Today’s Practice and POA notes are saved to Supabase under this tester account.
      </p>
      <ion-button class="sign-out-button" fill="outline" color="medium" :disabled="authBusy" @click="signOut">
        Sign out
      </ion-button>
    </template>

    <template v-else-if="authStatus === 'misconfigured'">
      <p class="auth-copy">
        Supabase is not configured for this build. Set <code>VITE_SUPABASE_URL</code> and
        <code>VITE_SUPABASE_ANON_KEY</code> from the approved Supabase project before beta testing.
      </p>
    </template>

    <template v-else-if="authStatus === 'error'">
      <p class="auth-copy" role="alert">
        {{ authError ?? 'Supabase session check failed. Verify network and environment settings.' }}
      </p>
    </template>

    <template v-else-if="authStatus === 'unknown'">
      <p class="auth-copy">Checking for a Supabase session…</p>
    </template>

    <template v-else>
      <p class="auth-copy">
        Create or sign in to a Supabase tester account before saving Today’s Practice, POA notes, or feedback.
      </p>
      <ion-button
        v-if="!showForm"
        class="show-auth-form-button"
        fill="outline"
        color="dark"
        @click="showForm = true"
      >
        Sign in or create account
      </ion-button>
      <form v-else class="auth-form" @submit.prevent="submit('sign-in')">
        <div class="auth-field">
          <label for="auth-email">Email</label>
          <input
            id="auth-email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            autocapitalize="none"
            spellcheck="false"
            required
          />
        </div>
        <div class="auth-field">
          <label for="auth-password">Password</label>
          <input
            id="auth-password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            minlength="6"
          />
        </div>
        <div class="auth-actions">
          <ion-button class="sign-in-button" type="submit" color="primary" :disabled="authBusy">
            Sign in
          </ion-button>
          <ion-button
            class="create-account-button"
            type="button"
            fill="outline"
            color="dark"
            :disabled="authBusy"
            @click="submit('sign-up')"
          >
            Create account
          </ion-button>
        </div>
        <p v-if="authError" class="auth-error" role="alert">{{ authError }}</p>
      </form>
    </template>

    <p class="auth-disclaimer">
      Secure beta path: Supabase Auth, Postgres, and Row Level Security. The browser uses only the Supabase anon key; service-role keys must never be placed in Vite env.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonButton } from '@ionic/vue';
import {
  authBusy,
  authError,
  authStatus,
  currentUser,
  signIn,
  signOut,
  signUp,
} from '@/stores/authStore';

const email = ref('');
const password = ref('');
const showForm = ref(false);

const statusLabel = computed(() => {
  switch (authStatus.value) {
    case 'signed-in':
      return 'Signed in';
    case 'misconfigured':
      return 'Setup needed';
    case 'error':
      return 'Auth check failed';
    case 'unknown':
      return 'Checking…';
    default:
      return 'Signed out';
  }
});

async function submit(mode: 'sign-in' | 'sign-up'): Promise<void> {
  const action = mode === 'sign-up' ? signUp : signIn;
  const succeeded = await action(email.value.trim(), password.value);

  if (succeeded) {
    email.value = '';
    password.value = '';
    showForm.value = false;
  }
}
</script>

<style scoped>
.auth-panel {
  background: rgba(255, 253, 247, 0.92);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(65, 43, 22, 0.12);
  color: #372416;
  display: grid;
  gap: 12px;
  padding: 18px;
}

.auth-heading {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.auth-kicker {
  color: #8a5c25;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.auth-panel h2 {
  color: #2e1c0f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.35rem, 6vw, 2rem);
  line-height: 1.04;
  margin: 0;
}

.auth-status-pill {
  background: rgba(55, 36, 22, 0.08);
  border-radius: 999px;
  color: #5b3a17;
  flex: 0 0 auto;
  font-size: 0.74rem;
  font-weight: 900;
  padding: 8px 10px;
}

.auth-status-pill.status-signed-in {
  background: rgba(55, 120, 72, 0.14);
  color: #244a2e;
}

.auth-status-pill.status-misconfigured,
.auth-status-pill.status-error {
  background: rgba(190, 18, 60, 0.08);
  color: #8c1f3e;
}

.auth-copy {
  color: rgba(55, 36, 22, 0.74);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.auth-copy code {
  background: rgba(55, 36, 22, 0.07);
  border-radius: 6px;
  font-size: 0.82rem;
  padding: 2px 5px;
}

.current-username {
  color: #2e1c0f;
}

.sign-out-button,
.show-auth-form-button {
  justify-self: start;
  min-height: 44px;
}

.auth-form {
  display: grid;
  gap: 10px;
}

.auth-field {
  display: grid;
  gap: 6px;
}

.auth-field label {
  color: #372416;
  font-size: 0.84rem;
  font-weight: 900;
}

.auth-field input {
  background: rgba(55, 36, 22, 0.04);
  border: 1px solid rgba(75, 52, 29, 0.22);
  border-radius: 14px;
  color: #372416;
  font: inherit;
  min-height: 44px;
  padding: 10px 12px;
  width: 100%;
}

.auth-field input:focus {
  border-color: rgba(138, 92, 36, 0.6);
  box-shadow: 0 0 0 3px rgba(138, 92, 36, 0.14);
  outline: none;
}

.auth-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.auth-actions ion-button {
  min-height: 44px;
}

.auth-error {
  background: rgba(190, 18, 60, 0.08);
  border: 1px solid rgba(190, 18, 60, 0.2);
  border-radius: 12px;
  color: #8c1f3e;
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
  padding: 10px 12px;
}

.auth-disclaimer {
  border-top: 1px dashed rgba(75, 52, 29, 0.2);
  color: rgba(55, 36, 22, 0.6);
  font-size: 0.78rem;
  line-height: 1.45;
  margin: 0;
  padding-top: 10px;
}
</style>
