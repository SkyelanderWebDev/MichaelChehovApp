<template>
  <ion-card class="daily-action-card" aria-labelledby="daily-action-title">
    <ion-card-header>
      <p class="daily-action-kicker">Today’s POA</p>
      <h2 id="daily-action-title">Daily Action / POA</h2>
    </ion-card-header>

    <ion-card-content>
      <p class="poa-copy">
        POA means Practice / Observe / Apply. Save a short note for today’s work with this locked tool.
      </p>

      <div class="poa-sections" aria-hidden="true">
        <span class="poa-section">Practice</span>
        <span class="poa-section">Observe</span>
        <span class="poa-section">Apply</span>
      </div>

      <div class="daily-action-field">
        <label for="daily-action-note">Daily Action / POA note</label>
        <textarea
          id="daily-action-note"
          v-model="draft"
          aria-label="Daily Action / POA note"
          rows="5"
          placeholder="Optional note for today’s Practice / Observe / Apply work."
        />
      </div>

      <div class="daily-action-footer">
        <ion-button color="primary" @click="saveDailyAction">
          Save Daily Action
        </ion-button>
        <p v-if="hasSavedEntry" class="saved-note" aria-live="polite">
          Daily Action saved.
        </p>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import type { POAEntry } from '@/types/practice';

const props = defineProps<{
  entry: POAEntry | null;
}>();

const emit = defineEmits<{
  (event: 'save', journalText: string): void;
}>();

const draft = ref(props.entry?.journalText ?? '');
const hasSavedEntry = computed(() => Boolean(props.entry?.updatedAt));

watch(
  () => props.entry?.journalText,
  (journalText) => {
    draft.value = journalText ?? '';
  },
);

function saveDailyAction(): void {
  emit('save', draft.value);
}
</script>

<style scoped>
.daily-action-card {
  --background: #fffdf7;
  border: 1px solid rgba(55, 120, 72, 0.22);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  margin: 0;
}

.poa-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 10px;
}

.poa-section {
  background: rgba(55, 120, 72, 0.1);
  border: 1px solid rgba(55, 120, 72, 0.22);
  border-radius: 999px;
  color: #244a2e;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 6px 10px;
  text-transform: uppercase;
}

.daily-action-kicker {
  color: #39764a;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.daily-action-card h2 {
  color: #2e1c0f;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 6vw, 2rem);
  line-height: 1.06;
  margin: 0;
}

.poa-copy {
  color: rgba(55, 36, 22, 0.74);
  font-size: 0.95rem;
  line-height: 1.45;
  margin: 0 0 14px;
}

.daily-action-field {
  display: grid;
  gap: 8px;
}

.daily-action-field label {
  color: #372416;
  font-size: 0.84rem;
  font-weight: 900;
}

.daily-action-field textarea {
  background: rgba(55, 36, 22, 0.04);
  border: 1px solid rgba(75, 52, 29, 0.22);
  border-radius: 16px;
  color: #372416;
  font: inherit;
  line-height: 1.45;
  min-height: 128px;
  padding: 12px;
  resize: vertical;
  width: 100%;
}

.daily-action-field textarea:focus {
  border-color: rgba(55, 120, 72, 0.65);
  box-shadow: 0 0 0 3px rgba(55, 120, 72, 0.14);
  outline: none;
}

.daily-action-footer {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.saved-note {
  background: rgba(55, 120, 72, 0.12);
  border: 1px solid rgba(55, 120, 72, 0.22);
  border-radius: 999px;
  color: #244a2e;
  font-size: 0.86rem;
  font-weight: 900;
  margin: 0;
  padding: 8px 10px;
}
</style>
