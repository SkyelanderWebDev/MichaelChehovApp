<template>
  <ion-page>
    <ion-content class="chat-rooms-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Community</p>
          <h1>Group chat</h1>
          <p class="page-subtitle">
            Shared rooms for a class, a show, or the wider ensemble. Group conversations only;
            there is no one-to-one direct messaging.
          </p>
        </header>

        <section v-if="authStatus === 'unknown'" class="studio-panel" aria-label="Checking session">
          <p class="panel-copy">Checking your session…</p>
        </section>

        <section
          v-else-if="!isSignedIn"
          class="studio-panel access-gate"
          aria-labelledby="chat-gate-title"
          data-testid="chat-tester-gate"
        >
          <p class="kicker">Private beta</p>
          <h2 id="chat-gate-title">Tester access</h2>
          <p class="panel-copy">Tester access is required to join and read group rooms.</p>
          <p v-if="authStatus === 'misconfigured'" class="panel-copy">
            Tester access isn’t available in this build yet. Details are in Settings → Beta data &amp;
            security.
          </p>
          <ion-button v-else color="primary" @click="isAccessSheetOpen = true">
            Get tester access
          </ion-button>
        </section>

        <template v-else>
          <p v-if="loadError" class="error-banner" role="alert">{{ loadError }}</p>

          <section class="studio-panel" aria-labelledby="my-rooms-title">
            <p class="kicker">Your rooms</p>
            <h2 id="my-rooms-title">Rooms you belong to</h2>

            <p v-if="roomsLoading" class="panel-copy">Loading rooms…</p>
            <p v-else-if="rooms.length === 0" class="panel-copy" data-testid="chat-empty-rooms">
              No rooms yet. Join with an invite code from your teacher, or create a room if you
              lead a class or show.
            </p>

            <ul v-else class="room-list" data-testid="chat-room-list">
              <li v-for="room in rooms" :key="room.id">
                <button class="room-row" type="button" @click="openRoom(room.id)">
                  <span class="room-row-main">
                    <span class="room-name">{{ room.name }}</span>
                    <span class="room-kind-pill">{{ room.kind }}</span>
                  </span>
                  <ion-icon :icon="chevronForwardOutline" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </section>

          <section class="studio-panel" aria-labelledby="join-room-title">
            <p class="kicker">Have a code?</p>
            <h2 id="join-room-title">Join a room</h2>
            <p class="panel-copy">Enter the invite code your teacher or ensemble lead shared.</p>
            <form class="inline-form" @submit.prevent="joinRoom">
              <ion-input
                v-model="joinCode"
                class="inline-input"
                label="Invite code"
                label-placement="stacked"
                placeholder="e.g. 4f9c21ab73"
                autocapitalize="off"
                autocorrect="off"
                :spellcheck="false"
                enterkeyhint="go"
                data-testid="chat-join-code"
              />
              <ion-button type="submit" :disabled="joinBusy || !joinCode.trim()">Join</ion-button>
            </form>
            <p v-if="joinError" class="error-banner" role="alert">{{ joinError }}</p>
          </section>

          <section
            v-if="creatorAllowed"
            class="studio-panel"
            aria-labelledby="create-room-title"
            data-testid="chat-create-room"
          >
            <p class="kicker">Room leads</p>
            <h2 id="create-room-title">Create a room</h2>
            <form class="inline-form" @submit.prevent="createNewRoom">
              <ion-input
                v-model="newRoomName"
                class="inline-input"
                label="Room name"
                label-placement="stacked"
                placeholder="e.g. Tuesday scene study"
                :maxlength="MAX_ROOM_NAME_LENGTH"
              />
              <ion-select
                v-model="newRoomKind"
                class="inline-input"
                label="Type"
                label-placement="stacked"
                interface="popover"
              >
                <ion-select-option value="class">Class</ion-select-option>
                <ion-select-option value="show">Show</ion-select-option>
                <ion-select-option value="community">Community</ion-select-option>
              </ion-select>
              <ion-button type="submit" :disabled="createBusy || !newRoomName.trim()">
                Create
              </ion-button>
            </form>
            <p v-if="createError" class="error-banner" role="alert">{{ createError }}</p>
          </section>

          <p class="chat-footnote">
            Messages are visible to everyone in a room and cannot be edited or deleted in this
            beta. Attachments and notifications arrive in a later update.
          </p>
        </template>

        <TesterAccessSheet :is-open="isAccessSheetOpen" @dismiss="isAccessSheetOpen = false" />
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { chevronForwardOutline } from 'ionicons/icons';
import TesterAccessSheet from '@/components/TesterAccessSheet.vue';
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import {
  MAX_ROOM_NAME_LENGTH,
  canCreateRooms,
  createRoom,
  joinRoomByCode,
  listMyRooms,
} from '@/stores/chatStore';
import type { ChatRoom, ChatRoomKind } from '@/types/chat';

const router = useRouter();

const isAccessSheetOpen = ref(false);
const rooms = ref<ChatRoom[]>([]);
const roomsLoading = ref(false);
const creatorAllowed = ref(false);
const joinBusy = ref(false);
const createBusy = ref(false);
const loadError = ref<string | null>(null);
const joinCode = ref('');
const joinError = ref<string | null>(null);
const newRoomName = ref('');
const newRoomKind = ref<ChatRoomKind>('class');
const createError = ref<string | null>(null);

const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));

onMounted(async () => {
  await loadSession();
  if (isSignedIn.value) {
    await refreshRooms();
  }
});

async function refreshRooms(): Promise<void> {
  roomsLoading.value = true;
  loadError.value = null;

  try {
    const [myRooms, allowed] = await Promise.all([listMyRooms(), canCreateRooms()]);
    rooms.value = myRooms;
    creatorAllowed.value = allowed;
  } catch {
    loadError.value = 'Unable to load rooms right now. Pull to refresh or try again shortly.';
  } finally {
    roomsLoading.value = false;
  }
}

function openRoom(roomId: string): void {
  router.push(`/connect/chat/${roomId}`);
}

async function joinRoom(): Promise<void> {
  joinError.value = null;
  joinBusy.value = true;

  try {
    const roomId = await joinRoomByCode(joinCode.value);
    joinCode.value = '';
    if (roomId) {
      router.push(`/connect/chat/${roomId}`);
    }
  } catch (error) {
    joinError.value =
      error instanceof Error && error.message.includes('invite code')
        ? 'No open room matches that invite code.'
        : 'Unable to join with that code right now.';
  } finally {
    joinBusy.value = false;
  }
}

async function createNewRoom(): Promise<void> {
  createError.value = null;
  createBusy.value = true;

  try {
    const room = await createRoom(newRoomName.value, newRoomKind.value);
    newRoomName.value = '';
    if (room) {
      router.push(`/connect/chat/${room.id}`);
    }
  } catch {
    createError.value = 'Unable to create the room. Check your room-lead access and try again.';
  } finally {
    createBusy.value = false;
  }
}
</script>

<style scoped>
.room-list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.room-row {
  align-items: center;
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  color: var(--text-primary);
  display: flex;
  gap: 8px;
  justify-content: space-between;
  min-height: 52px;
  padding: 10px 14px;
  text-align: left;
  width: 100%;
}

.room-row-main {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.room-name {
  font-weight: 700;
  overflow-wrap: anywhere;
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

.inline-form {
  display: grid;
  gap: 10px;
  width: 100%;
}

.inline-input {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  --padding-start: 12px;
  --padding-end: 12px;
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

.chat-footnote {
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.45;
  margin: 0;
  text-align: center;
}
</style>
