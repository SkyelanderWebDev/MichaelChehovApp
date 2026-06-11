<template>
  <ion-modal
    class="tester-access-modal"
    :is-open="isOpen"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    @didDismiss="$emit('dismiss')"
  >
    <ion-content class="sheet-content">
      <div class="sheet-shell">
        <header>
          <p class="kicker">Private beta</p>
          <h2 id="tester-access-title">Tester access</h2>
          <p class="sheet-copy">
            Tester access is required to save today’s practice and POA.
          </p>
        </header>

        <template v-if="authStatus === 'signed-in' && currentUser">
          <p class="sheet-copy signed-in-copy">
            Signed in as <strong class="current-username">{{ currentUser.email }}</strong>.
            Today’s Practice and POA notes are saved to your tester account.
          </p>
          <ion-button class="sign-out-button" fill="outline" color="medium" :disabled="authBusy" @click="signOut">
            Sign out
          </ion-button>
        </template>

        <template v-else-if="authStatus === 'misconfigured'">
          <p class="sheet-copy" role="alert">
            Tester access isn’t available in this build yet. Technical details are in
            Settings → Beta data &amp; security.
          </p>
        </template>

        <form v-else class="auth-form" @submit.prevent="submit('sign-in')">
          <div class="auth-field">
            <label for="tester-email">Email</label>
            <input
              id="tester-email"
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
            <label for="tester-password">Password</label>
            <input
              id="tester-password"
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
              color="medium"
              :disabled="authBusy"
              @click="submit('sign-up')"
            >
              Create account
            </ion-button>
          </div>
          <p v-if="authError" class="auth-error" role="alert">{{ authError }}</p>
        </form>

        <p class="sheet-footnote">
          Saved to your tester account. Beta data and security details live in Settings.
        </p>
      </div>
    </ion-content>

    <ion-footer class="sheet-footer">
      <div class="sheet-footer-inner">
        <ion-button class="close-tester-access" expand="block" fill="outline" color="medium" @click="$emit('dismiss')">
          Done
        </ion-button>
      </div>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonContent, IonFooter, IonModal } from '@ionic/vue';
import { authBusy, authError, authStatus, currentUser, signIn, signOut, signUp } from '@/stores/authStore';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (event: 'dismiss'): void;
}>();

const email = ref('');
const password = ref('');

async function submit(mode: 'sign-in' | 'sign-up'): Promise<void> {
  const action = mode === 'sign-up' ? signUp : signIn;
  const succeeded = await action(email.value.trim(), password.value);

  if (succeeded) {
    email.value = '';
    password.value = '';
    emit('dismiss');
  }
}
</script>

<style scoped>
.sheet-content {
  --background: var(--app-bg-2);
}

.sheet-shell {
  color: var(--text-primary);
  display: grid;
  gap: 14px;
  margin: 0 auto;
  max-width: 560px;
  padding: 20px 16px 28px;
}

.sheet-shell h2 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 6.4vw, 2rem);
  font-weight: 600;
  line-height: 1.04;
  margin: 6px 0 0;
}

.sheet-copy {
  color: var(--text-secondary);
  font-size: 0.97rem;
  line-height: 1.5;
  margin: 8px 0 0;
}

.current-username {
  color: var(--text-primary);
}

.sign-out-button {
  justify-self: start;
  min-height: 44px;
}

.auth-form {
  display: grid;
  gap: 12px;
}

.auth-field {
  display: grid;
  gap: 6px;
}

.auth-field label {
  color: var(--text-primary);
  font-size: 0.84rem;
  font-weight: 800;
}

.auth-field input {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-field);
  color: var(--text-primary);
  font: inherit;
  min-height: 44px;
  padding: 10px 12px;
  width: 100%;
}

.auth-field input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-soft);
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
  background: rgba(184, 74, 72, 0.12);
  border: 1px solid rgba(184, 74, 72, 0.4);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
  padding: 10px 12px;
}

.sheet-footnote {
  border-top: 1px dashed var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.45;
  margin: 0;
  padding-top: 10px;
}

.sheet-footer {
  background: var(--app-bg-2);
}

.sheet-footer-inner {
  margin: 0 auto;
  max-width: 560px;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
}
</style>
