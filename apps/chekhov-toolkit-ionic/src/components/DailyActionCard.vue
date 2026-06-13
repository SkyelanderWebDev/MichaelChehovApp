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

      <div class="mode-control" role="group" aria-label="POA entry mode">
        <button
          type="button"
          :class="{ active: draft.mode === 'structured' }"
          :aria-pressed="draft.mode === 'structured'"
          @click="draft.mode = 'structured'"
        >
          Structured
        </button>
        <button
          type="button"
          :class="{ active: draft.mode === 'journal' }"
          :aria-pressed="draft.mode === 'journal'"
          @click="draft.mode = 'journal'"
        >
          Free response
        </button>
      </div>

      <div v-if="draft.mode === 'structured'" class="structured-fields">
        <section class="poa-field-group" aria-labelledby="practice-field-label">
          <h3 id="practice-field-label">Practice</h3>
          <div class="daily-action-field">
            <label for="poa-practice">Practice</label>
            <textarea
              id="poa-practice"
              v-model="draft.practiceNotes"
              rows="4"
              placeholder="Practice notes for today."
            />
          </div>
        </section>

        <section class="poa-field-group" aria-labelledby="observe-field-label">
          <h3 id="observe-field-label">Observe</h3>
          <div class="field-grid">
            <div class="daily-action-field">
              <label for="poa-observe-morning">Observe Morning</label>
              <textarea
                id="poa-observe-morning"
                v-model="draft.observeMorning"
                rows="3"
                placeholder="Morning observation."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-observe-midday">Observe Midday</label>
              <textarea
                id="poa-observe-midday"
                v-model="draft.observeMidday"
                rows="3"
                placeholder="Midday observation."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-observe-evening">Observe Evening</label>
              <textarea
                id="poa-observe-evening"
                v-model="draft.observeEvening"
                rows="3"
                placeholder="Evening observation."
              />
            </div>
          </div>
        </section>

        <section class="poa-field-group" aria-labelledby="apply-field-label">
          <h3 id="apply-field-label">Apply</h3>
          <div class="field-grid">
            <div class="daily-action-field">
              <label for="poa-apply-morning">Apply Morning</label>
              <textarea
                id="poa-apply-morning"
                v-model="draft.applyMorning"
                rows="3"
                placeholder="Morning application."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-apply-midday">Apply Midday</label>
              <textarea
                id="poa-apply-midday"
                v-model="draft.applyMidday"
                rows="3"
                placeholder="Midday application."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-apply-evening">Apply Evening</label>
              <textarea
                id="poa-apply-evening"
                v-model="draft.applyEvening"
                rows="3"
                placeholder="Evening application."
              />
            </div>
          </div>
        </section>
      </div>

      <div v-else class="daily-action-field">
        <label for="daily-action-note">Free response</label>
        <textarea
          id="daily-action-note"
          v-model="draft.journalText"
          aria-label="Free response POA note"
          rows="8"
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
import { computed, reactive, watch } from 'vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import type { POADraft, POAEntry } from '@/types/practice';

const props = defineProps<{
  entry: POAEntry | null;
}>();

const emit = defineEmits<{
  (event: 'save', payload: POADraft): void;
}>();

const draft = reactive<POADraft>(createDraft(props.entry));
const hasSavedEntry = computed(() => Boolean(props.entry?.updatedAt));

watch(
  () => props.entry,
  (entry) => {
    Object.assign(draft, createDraft(entry));
  },
  { deep: true },
);

function saveDailyAction(): void {
  emit('save', { ...draft });
}

function createDraft(entry: POAEntry | null): POADraft {
  return {
    mode: entry?.mode ?? 'structured',
    practiceNotes: entry?.practiceNotes ?? '',
    observeMorning: entry?.observeMorning ?? '',
    observeMidday: entry?.observeMidday ?? '',
    observeEvening: entry?.observeEvening ?? '',
    applyMorning: entry?.applyMorning ?? '',
    applyMidday: entry?.applyMidday ?? '',
    applyEvening: entry?.applyEvening ?? '',
    journalText: entry?.journalText ?? '',
  };
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

.mode-control {
  background: rgba(55, 36, 22, 0.06);
  border: 1px solid rgba(75, 52, 29, 0.16);
  border-radius: 999px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 14px;
  padding: 4px;
}

.mode-control button {
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: rgba(55, 36, 22, 0.72);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 900;
  min-height: 40px;
  padding: 8px 10px;
}

.mode-control button.active {
  background: #fffdf7;
  box-shadow: 0 6px 18px rgba(53, 35, 18, 0.1);
  color: #244a2e;
}

.structured-fields {
  display: grid;
  gap: 14px;
}

.poa-field-group {
  background: rgba(55, 36, 22, 0.025);
  border: 1px solid rgba(75, 52, 29, 0.12);
  border-radius: 18px;
  display: grid;
  gap: 10px;
  padding: 12px;
}

.poa-field-group h3 {
  color: #2e1c0f;
  font-size: 0.95rem;
  font-weight: 900;
  margin: 0;
}

.field-grid {
  display: grid;
  gap: 10px;
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

@media (min-width: 720px) {
  .field-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
