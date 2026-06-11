<template>
  <div class="appearance-selector" role="radiogroup" aria-label="Appearance">
    <button
      v-for="option in OPTIONS"
      :key="option.value"
      class="appearance-option"
      type="button"
      role="radio"
      :aria-checked="appearance === option.value"
      :class="{ active: appearance === option.value }"
      @click="setAppearance(option.value)"
    >
      <ion-icon aria-hidden="true" :icon="option.icon" />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { contrastOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { appearance, setAppearance, type AppearancePreference } from '@/stores/themeStore';

const OPTIONS: ReadonlyArray<{ value: AppearancePreference; label: string; icon: string }> = [
  { value: 'system', label: 'System', icon: contrastOutline },
  { value: 'light', label: 'Light', icon: sunnyOutline },
  { value: 'dark', label: 'Dark', icon: moonOutline },
];
</script>

<style scoped>
.appearance-selector {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(3, 1fr);
  padding: 4px;
}

.appearance-option {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  font-weight: 800;
  gap: 4px;
  justify-content: center;
  min-height: 56px;
  padding: 8px 6px;
  transition: background 160ms ease, color 160ms ease;
}

.appearance-option ion-icon {
  font-size: 1.2rem;
}

.appearance-option.active {
  background: var(--surface);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}
</style>
