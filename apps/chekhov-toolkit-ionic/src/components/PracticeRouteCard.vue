<template>
  <button class="practice-route-card" type="button" :disabled="disabled" @click="$emit('select')">
    <span class="route-icon" aria-hidden="true">
      <ion-icon :icon="icon" />
    </span>
    <span class="route-copy">
      <strong class="route-title">{{ title }}</strong>
      <span class="route-description">{{ description }}</span>
    </span>
    <ion-icon class="route-chevron" aria-hidden="true" :icon="chevronForwardOutline" />
  </button>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { chevronForwardOutline } from 'ionicons/icons';

defineProps<{
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
}>();

defineEmits<{
  (event: 'select'): void;
}>();
</script>

<style scoped>
.practice-route-card {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 18px;
  color: var(--text-primary);
  display: flex;
  gap: 12px;
  min-height: 64px;
  padding: 12px 14px;
  text-align: left;
  transition: border-color 160ms ease, transform 160ms ease;
  width: 100%;
}

.practice-route-card:not(:disabled):active {
  transform: scale(0.99);
}

.practice-route-card:not(:disabled):hover {
  border-color: var(--accent-primary);
}

.practice-route-card:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.route-icon {
  align-items: center;
  background: var(--accent-soft);
  border-radius: 999px;
  color: var(--accent-primary);
  display: flex;
  flex: 0 0 auto;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.route-icon ion-icon {
  font-size: 1.3rem;
}

.route-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.route-title {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
}

.route-description {
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.35;
}

.route-chevron {
  color: var(--text-secondary);
  flex: 0 0 auto;
  font-size: 1.1rem;
  margin-left: auto;
}
</style>
