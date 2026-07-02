<template>
  <ion-page>
    <ion-content ref="contentRef" class="chat-room-page">
      <main class="page-shell chat-shell">
        <header class="page-intro chat-header">
          <button class="back-link" type="button" @click="goBack">
            <ion-icon :icon="chevronBackOutline" aria-hidden="true" />
            <span>Group chat</span>
          </button>
          <h1 v-if="room" class="room-title">{{ room.name }}</h1>
          <h1 v-else class="room-title">Room</h1>
          <p v-if="room" class="page-subtitle room-meta">
            <span class="room-kind-pill">{{ room.kind }}</span>
            <span v-if="isOwner" class="invite-line">
              Invite code: <code data-testid="chat-invite-code">{{ room.inviteCode }}</code>
            </span>
          </p>
        </header>

        <section v-if="authStatus === 'unknown'" class="studio-panel" aria-label="Checking session">
          <p class="panel-copy">Checking your session…</p>
        </section>

        <section
          v-else-if="!isSignedIn"
          class="studio-panel access-gate"
          aria-labelledby="chat-room-gate-title"
        >
          <p class="kicker">Private beta</p>
          <h2 id="chat-room-gate-title">Tester access</h2>
          <p class="panel-copy">Tester access is required to read this room.</p>
          <p v-if="authStatus === 'misconfigured'" class="panel-copy">
            Tester access isn’t available in this build yet. Details are in Settings → Beta data
            &amp; security.
          </p>
          <ion-button
            v-else
            class="open-tester-access"
            color="primary"
            @click="isAccessSheetOpen = true"
          >
            Get tester access
          </ion-button>
        </section>

        <template v-else>
          <p v-if="loadError" class="error-banner" role="alert">{{ loadError }}</p>

          <section class="message-panel" aria-label="Messages">
            <p v-if="messagesLoading && messages.length === 0" class="panel-copy">
              Loading messages…
            </p>
            <p
              v-else-if="messages.length === 0 && !loadError"
              class="panel-copy empty-thread"
              data-testid="chat-empty-thread"
            >
              No messages yet. Say hello to the room.
            </p>

            <ol v-else class="message-list" data-testid="chat-message-list">
              <li
                v-for="message in messages"
                :key="message.id"
                :class="['message-row', message.senderId === currentUserId ? 'own' : 'incoming']"
              >
                <div class="bubble">
                  <p class="bubble-sender">{{ label(message) }}</p>
                  <p class="bubble-body">{{ message.body }}</p>
                  <p class="bubble-time">{{ formatTime(message.createdAt) }}</p>
                </div>
              </li>
            </ol>
          </section>
        </template>

        <TesterAccessSheet :is-open="isAccessSheetOpen" @dismiss="isAccessSheetOpen = false" />
      </main>
    </ion-content>

    <ion-footer v-if="isSignedIn" class="composer-footer">
      <form class="composer" @submit.prevent="submitMessage">
        <ion-textarea
          v-model="draft"
          class="composer-input"
          :auto-grow="true"
          :rows="1"
          :maxlength="MAX_MESSAGE_LENGTH"
          placeholder="Message the room"
          aria-label="Message the room"
          data-testid="chat-composer-input"
        />
        <ion-button
          type="submit"
          class="composer-send"
          :disabled="sendBusy || !draft.trim()"
          aria-label="Send message"
          data-testid="chat-composer-send"
        >
          <ion-icon slot="icon-only" :icon="sendOutline" />
        </ion-button>
      </form>
      <p v-if="sendError" class="error-banner composer-error" role="alert">{{ sendError }}</p>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonButton, IonContent, IonFooter, IonIcon, IonPage, IonTextarea } from '@ionic/vue';
import { chevronBackOutline, sendOutline } from 'ionicons/icons';
import TesterAccessSheet from '@/components/TesterAccessSheet.vue';
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import {
  MAX_MESSAGE_LENGTH,
  getRoom,
  listRoomMessages,
  sendMessage,
  senderLabel,
} from '@/stores/chatStore';
import type { ChatMessage, ChatRoom } from '@/types/chat';

const POLL_INTERVAL_MS = 5000;

const route = useRoute();
const router = useRouter();

const contentRef = ref<InstanceType<typeof IonContent> | null>(null);
const room = ref<ChatRoom | null>(null);
const messages = ref<ChatMessage[]>([]);
const messagesLoading = ref(false);
const loadError = ref<string | null>(null);
const draft = ref('');
const sendBusy = ref(false);
const sendError = ref<string | null>(null);
const isAccessSheetOpen = ref(false);
let pollTimer: ReturnType<typeof setInterval> | null = null;

const roomId = computed(() => String(route.params.roomId ?? ''));
const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));
const currentUserId = computed(() => currentUser.value?.id ?? null);
const isOwner = computed(
  () => Boolean(room.value && currentUserId.value && room.value.createdBy === currentUserId.value),
);

onMounted(async () => {
  await loadSession();
  if (!isSignedIn.value || !roomId.value) return;

  await refreshRoom();
  await refreshMessages();
  await scrollToLatest();
  pollTimer = setInterval(() => {
    if (typeof document !== 'undefined' && document.hidden) return;
    void refreshMessages({ silent: true });
  }, POLL_INTERVAL_MS);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

async function refreshRoom(): Promise<void> {
  try {
    room.value = await getRoom(roomId.value);
    if (!room.value) {
      loadError.value = 'This room is not available to your account.';
    }
  } catch {
    loadError.value = 'Unable to load this room right now.';
  }
}

async function refreshMessages(options: { silent?: boolean } = {}): Promise<void> {
  if (!options.silent) messagesLoading.value = true;

  try {
    const previousCount = messages.value.length;
    messages.value = await listRoomMessages(roomId.value);
    loadError.value = room.value ? null : loadError.value;
    if (messages.value.length > previousCount) {
      await scrollToLatest();
    }
  } catch {
    if (!options.silent) {
      loadError.value = 'Unable to load messages right now.';
    }
  } finally {
    messagesLoading.value = false;
  }
}

async function submitMessage(): Promise<void> {
  sendError.value = null;
  sendBusy.value = true;

  try {
    const sent = await sendMessage(roomId.value, draft.value);
    if (sent) {
      messages.value = [...messages.value, sent];
      draft.value = '';
      await scrollToLatest();
    }
  } catch {
    sendError.value = 'Message not sent. Check your connection and try again.';
  } finally {
    sendBusy.value = false;
  }
}

function label(message: ChatMessage): string {
  return senderLabel(message, currentUserId.value);
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

async function scrollToLatest(): Promise<void> {
  await nextTick();
  const content = contentRef.value?.$el as { scrollToBottom?: (duration?: number) => void } | undefined;
  content?.scrollToBottom?.(0);
}

function goBack(): void {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push('/connect/chat');
  }
}
</script>

<style scoped>
.chat-shell {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  /* The composer footer replaces the usual floating-tab-bar clearance. */
  padding-bottom: 16px;
}

.error-banner {
  background: rgba(184, 74, 72, 0.14);
  border: 1px solid rgba(184, 74, 72, 0.45);
  border-radius: 16px;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  padding: 12px 14px;
}

.access-gate h2 {
  margin-top: 6px;
}

.open-tester-access {
  margin-top: 12px;
  min-height: 44px;
}

.back-link {
  align-items: center;
  background: none;
  border: none;
  color: var(--accent-primary);
  display: inline-flex;
  font-size: 0.9rem;
  font-weight: 700;
  gap: 2px;
  margin-left: -8px;
  min-height: 44px;
  padding: 8px;
}

.room-title {
  overflow-wrap: anywhere;
}

.room-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-kind-pill {
  background: var(--accent-soft);
  border-radius: 999px;
  color: var(--accent-primary);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  text-transform: uppercase;
}

.invite-line code {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 1px 6px;
  user-select: all;
}

.message-panel {
  display: grid;
  gap: 8px;
  width: 100%;
}

.empty-thread {
  text-align: center;
}

.message-list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.own {
  justify-content: flex-end;
}

.message-row.incoming {
  justify-content: flex-start;
}

.bubble {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  display: grid;
  gap: 2px;
  max-width: min(78%, 520px);
  padding: 8px 12px;
}

.message-row.own .bubble {
  background: var(--accent-soft);
  border-color: transparent;
}

.bubble-sender {
  color: var(--accent-primary);
  font-size: 0.72rem;
  font-weight: 800;
  margin: 0;
}

.bubble-body {
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.bubble-time {
  color: var(--text-secondary);
  font-size: 0.68rem;
  margin: 0;
  text-align: right;
}

.composer-footer {
  background: var(--app-bg-1, var(--ion-background-color));
  border-top: 1px solid var(--border-subtle);
  padding: 8px 12px;
}

.composer {
  align-items: flex-end;
  display: flex;
  gap: 8px;
  margin: 0 auto;
  max-width: 720px;
}

.composer-input {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  flex: 1;
  /* Cap autogrow so a long draft never swallows the thread. */
  max-height: 132px;
  min-width: 0;
  overflow-y: auto;
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 8px;
  --padding-bottom: 8px;
}

.composer-send {
  flex-shrink: 0;
  margin: 0;
  min-height: 44px;
  min-width: 44px;
}

.composer-error {
  margin: 6px auto 0;
  max-width: 720px;
}
</style>
