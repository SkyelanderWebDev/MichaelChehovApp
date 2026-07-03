<template>
  <ion-page>
    <ion-content class="chat-invite-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Community</p>
          <h1>Room invite</h1>
          <p class="page-subtitle">
            You have been invited to a private group room in the Michael Chekhov Toolkit beta.
          </p>
        </header>

        <section v-if="authStatus === 'unknown'" class="studio-panel" aria-label="Checking session">
          <p class="panel-copy">Checking your session…</p>
        </section>

        <section
          v-else-if="!hasToken"
          class="studio-panel"
          aria-label="Invite link problem"
          data-testid="chat-invite-missing-token"
        >
          <p class="kicker">Invite</p>
          <h2>Link incomplete</h2>
          <p class="panel-copy">
            This invite link is incomplete. Ask the room owner to send you a fresh link.
          </p>
        </section>

        <section
          v-else-if="!isSignedIn"
          class="studio-panel access-gate"
          aria-labelledby="invite-gate-title"
          data-testid="chat-invite-gate"
        >
          <p class="kicker">Private beta</p>
          <h2 id="invite-gate-title">Tester access</h2>
          <p class="panel-copy">
            Tester access is required to accept this invite. Sign in with the email address the
            invite was sent to, and we will add you to the room automatically.
          </p>
          <p v-if="authStatus === 'misconfigured'" class="panel-copy">
            Tester access isn’t available in this build yet. Details are in Settings → Beta data
            &amp; security.
          </p>
          <ion-button v-else color="primary" @click="isAccessSheetOpen = true">
            Get tester access
          </ion-button>
        </section>

        <template v-else>
          <section v-if="accepting" class="studio-panel" aria-label="Accepting invite">
            <p class="panel-copy">Accepting your invite…</p>
          </section>

          <section
            v-else-if="acceptError"
            class="studio-panel"
            aria-label="Invite problem"
            data-testid="chat-invite-error"
          >
            <p class="kicker">Invite</p>
            <h2>Unable to accept</h2>
            <p class="error-banner" role="alert">{{ acceptError }}</p>
            <ion-button fill="outline" @click="goToRooms">Back to group chat</ion-button>
          </section>

          <section v-else class="studio-panel" aria-label="Invite accepted">
            <p class="panel-copy">Invite accepted. Opening your room…</p>
          </section>
        </template>

        <TesterAccessSheet :is-open="isAccessSheetOpen" @dismiss="isAccessSheetOpen = false" />
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import TesterAccessSheet from '@/components/TesterAccessSheet.vue';
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import {
  acceptInvitation,
  clearPendingInviteToken,
  readPendingInviteToken,
  storePendingInviteToken,
} from '@/stores/chatStore';

const route = useRoute();
const router = useRouter();

const isAccessSheetOpen = ref(false);
const token = ref('');
const accepting = ref(false);
const accepted = ref(false);
const acceptError = ref<string | null>(null);

const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));
const hasToken = computed(() => Boolean(token.value));

onMounted(async () => {
  const queryToken = typeof route.query.token === 'string' ? route.query.token.trim() : '';
  token.value = queryToken || readPendingInviteToken()?.trim() || '';

  await loadSession();

  if (token.value && !isSignedIn.value) {
    // Park the token so the accept survives the tester-access sign-in flow.
    storePendingInviteToken(token.value);
  }

  if (isSignedIn.value) {
    await tryAccept();
  }
});

watch(currentUser, async () => {
  if (isSignedIn.value && hasToken.value && !accepted.value && !accepting.value) {
    await tryAccept();
  }
});

async function tryAccept(): Promise<void> {
  if (!token.value) return;

  accepting.value = true;
  acceptError.value = null;

  try {
    const roomId = await acceptInvitation(token.value);
    if (roomId) {
      accepted.value = true;
      clearPendingInviteToken();
      isAccessSheetOpen.value = false;
      router.replace(`/connect/chat/${roomId}`);
    } else {
      acceptError.value = 'Unable to accept this invite right now. Try the link again shortly.';
    }
  } catch (error) {
    acceptError.value = mapAcceptError(error);
  } finally {
    accepting.value = false;
  }
}

function mapAcceptError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';

  if (message.includes('different email')) {
    // Keep the parked token: the tester may sign out and back in with the
    // invited email, and the watch above re-runs the accept.
    return 'This invite was sent to a different email address. Sign in with the invited email to accept it.';
  }

  clearPendingInviteToken();

  if (message.includes('expired')) return 'This invite has expired. Ask the room owner for a new one.';
  if (message.includes('revoked')) return 'This invite was revoked by the room owner.';
  if (message.includes('already been used')) return 'This invite has already been used.';
  if (message.includes('closed')) return 'This room is closed to new members.';

  return 'No invite matches this link. Ask the room owner for a fresh one.';
}

function goToRooms(): void {
  router.replace('/connect/chat');
}
</script>

<style scoped>
.error-banner {
  background: rgba(184, 74, 72, 0.14);
  border: 1px solid rgba(184, 74, 72, 0.45);
  border-radius: 16px;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 12px;
  padding: 12px 14px;
}

.access-gate h2 {
  margin-top: 6px;
}
</style>
