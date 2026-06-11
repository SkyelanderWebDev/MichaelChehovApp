<template>
  <div class="top-status-bar">
    <div class="identity">
      <span class="app-name">{{ APP_NAME }}</span>
      <span class="status-pill beta-chip">Private beta</span>
    </div>
    <button
      class="account-chip"
      type="button"
      :aria-label="accountLabel"
      @click="router.push('/settings')"
    >
      <ion-icon aria-hidden="true" :icon="personCircleOutline" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonIcon } from '@ionic/vue';
import { personCircleOutline } from 'ionicons/icons';
import { APP_NAME } from '@/constants/attribution';
import { authStatus, currentUser } from '@/stores/authStore';

const router = useRouter();

const accountLabel = computed(() =>
  authStatus.value === 'signed-in' && currentUser.value
    ? `Account: signed in as ${currentUser.value.email}. Open Settings.`
    : 'Account and tester access. Open Settings.',
);
</script>

<style scoped>
.top-status-bar {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding-top: env(safe-area-inset-top);
}

.identity {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.app-name {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.1;
}

.beta-chip {
  font-size: 0.66rem;
  padding: 5px 9px;
}

.account-chip {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-primary);
  display: flex;
  flex: 0 0 auto;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.account-chip ion-icon {
  font-size: 1.6rem;
}
</style>
