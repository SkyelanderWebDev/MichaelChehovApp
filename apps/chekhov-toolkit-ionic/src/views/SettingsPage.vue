<template>
  <ion-page>
    <ion-content class="settings-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Private beta</p>
          <h1>Settings</h1>
        </header>

        <section class="studio-panel settings-group" aria-labelledby="account-title">
          <p class="kicker">Account</p>
          <h2 id="account-title">Tester access</h2>

          <template v-if="authStatus === 'signed-in' && currentUser">
            <p class="panel-copy">
              Signed in as <strong class="current-username">{{ currentUser.email }}</strong>.
              Today’s Practice, POA notes, and feedback are saved to this tester account.
            </p>
            <ion-button class="sign-out-button" fill="outline" color="medium" :disabled="authBusy" @click="signOut">
              Sign out
            </ion-button>
          </template>

          <template v-else-if="authStatus === 'misconfigured'">
            <p class="panel-copy">
              Tester access isn’t available in this build yet. See Beta data &amp; security below for setup details.
            </p>
          </template>

          <template v-else>
            <p class="panel-copy">Tester access is required to save today’s practice and POA.</p>
            <ion-button class="open-tester-access" color="primary" @click="isAccessSheetOpen = true">
              Sign in or create account
            </ion-button>
          </template>

          <p v-if="authError" class="settings-error" role="alert">{{ authError }}</p>
        </section>

        <section class="studio-panel settings-group" aria-labelledby="appearance-title">
          <p class="kicker">Appearance</p>
          <h2 id="appearance-title">Theme</h2>
          <p class="panel-copy">Choose how the studio looks. System follows your device setting.</p>
          <AppearanceSelector />
        </section>

        <section class="studio-panel settings-group" aria-labelledby="beta-details-title">
          <p class="kicker">Beta data &amp; security</p>
          <h2 id="beta-details-title">How your data is stored</h2>

          <details class="beta-disclosure">
            <summary>Technical details</summary>
            <div class="disclosure-body">
              <p>
                Tester accounts use Supabase Auth with Postgres and Row Level Security, so each
                tester can only read and write their own practice, POA, and feedback rows.
              </p>
              <p>
                The browser uses only the Supabase anon key; service-role keys must never be placed
                in Vite env.
              </p>
              <p v-if="!authConfigured">
                This build is missing its Supabase configuration. Set <code>VITE_SUPABASE_URL</code>
                and <code>VITE_SUPABASE_ANON_KEY</code> from the beta Supabase project before
                beta testing.
              </p>
            </div>
          </details>
        </section>

        <section class="studio-panel settings-group" aria-labelledby="feedback-title">
          <p class="kicker">Tester feedback</p>
          <h2 id="feedback-title">Send a beta note</h2>
          <p class="panel-copy">
            Use this for tester friction, phone-install issues, or POA/practice flow notes.
          </p>
          <label class="feedback-label" for="beta-feedback">Feedback</label>
          <textarea
            id="beta-feedback"
            v-model="feedbackText"
            class="feedback-textarea"
            rows="4"
            maxlength="4000"
            :disabled="!isSignedIn || feedbackBusy"
            placeholder="What should Dawson/Lisa know from this test?"
          ></textarea>
          <p v-if="!isSignedIn" class="panel-copy feedback-hint">Tester access is required to send feedback.</p>
          <div class="feedback-actions">
            <ion-button color="primary" :disabled="!canSubmitFeedback" @click="submitBetaFeedback">
              Send feedback
            </ion-button>
            <p v-if="feedbackStatus" class="feedback-status" role="status">{{ feedbackStatus }}</p>
          </div>
        </section>

        <section class="paper-object settings-group about-card" aria-labelledby="about-title">
          <p class="about-kicker">About &amp; attribution</p>
          <h2 id="about-title">{{ APP_NAME }}</h2>
          <p>{{ BETA_DESCRIPTION }}</p>
          <p>{{ CHART_ATTRIBUTION }}</p>
        </section>

        <p class="build-note">Beta build {{ APP_VERSION }}</p>

        <TesterAccessSheet :is-open="isAccessSheetOpen" @dismiss="isAccessSheetOpen = false" />
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import AppearanceSelector from '@/components/AppearanceSelector.vue';
import TesterAccessSheet from '@/components/TesterAccessSheet.vue';
import { APP_NAME, BETA_DESCRIPTION, CHART_ATTRIBUTION } from '@/constants/attribution';
import { authBusy, authConfigured, authError, authStatus, currentUser, loadSession, signOut } from '@/stores/authStore';
import { getLocalDate, submitFeedback } from '@/stores/dailyPracticeStore';

const APP_VERSION = '0.0.1';

const isAccessSheetOpen = ref(false);
const feedbackText = ref('');
const feedbackStatus = ref<string | null>(null);
const feedbackBusy = ref(false);

const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));
const canSubmitFeedback = computed(
  () => isSignedIn.value && !feedbackBusy.value && feedbackText.value.trim().length > 0 && feedbackText.value.length <= 4000,
);

onMounted(() => {
  void loadSession();
});

async function submitBetaFeedback(): Promise<void> {
  const message = feedbackText.value.trim();
  if (!message || !isSignedIn.value) return;

  feedbackBusy.value = true;
  feedbackStatus.value = null;
  try {
    await submitFeedback(message, {
      localDate: getLocalDate(),
      source: 'in-app-beta-feedback',
    });
    feedbackText.value = '';
    feedbackStatus.value = 'Feedback saved. Thank you.';
  } catch (error) {
    feedbackStatus.value = error instanceof Error ? error.message : 'Unable to save feedback.';
  } finally {
    feedbackBusy.value = false;
  }
}
</script>

<style scoped>
.settings-group {
  display: grid;
  gap: 10px;
}

.settings-group h2 {
  margin-top: 2px;
}

.current-username {
  color: var(--text-primary);
}

.sign-out-button,
.open-tester-access {
  justify-self: start;
  min-height: 44px;
}

.settings-error {
  background: rgba(184, 74, 72, 0.12);
  border: 1px solid rgba(184, 74, 72, 0.4);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
  padding: 10px 12px;
}

.beta-disclosure {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
}

.beta-disclosure summary {
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 800;
  list-style: none;
  min-height: 44px;
  padding: 12px 14px;
}

.beta-disclosure summary::-webkit-details-marker {
  display: none;
}

.beta-disclosure summary::after {
  color: var(--text-secondary);
  content: '+';
  float: right;
  font-size: 1.1rem;
}

.beta-disclosure[open] summary::after {
  content: '-';
}

.disclosure-body {
  border-top: 1px solid var(--border-subtle);
  display: grid;
  gap: 10px;
  padding: 12px 14px 14px;
}

.disclosure-body p {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
}

.disclosure-body code {
  background: var(--surface);
  border-radius: 6px;
  font-size: 0.8rem;
  padding: 2px 5px;
}

.feedback-label {
  color: var(--text-primary);
  font-size: 0.84rem;
  font-weight: 800;
}

.feedback-textarea {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-field);
  color: var(--text-primary);
  font: inherit;
  min-height: 96px;
  padding: 10px 12px;
  resize: vertical;
  width: 100%;
}

.feedback-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-soft);
  outline: none;
}

.feedback-hint {
  font-size: 0.84rem;
}

.feedback-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feedback-actions ion-button {
  min-height: 44px;
}

.feedback-status {
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 700;
  margin: 0;
}

.about-card {
  font-size: 0.9rem;
}

.about-kicker {
  color: var(--text-on-paper-soft);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  margin: 0;
  text-transform: uppercase;
}

.about-card h2 {
  font-size: 1.15rem;
}

.about-card p {
  color: var(--text-on-paper-soft);
  line-height: 1.5;
  margin: 0;
}

.build-note {
  color: var(--text-secondary);
  font-size: 0.78rem;
  margin: 0;
  text-align: center;
}
</style>
