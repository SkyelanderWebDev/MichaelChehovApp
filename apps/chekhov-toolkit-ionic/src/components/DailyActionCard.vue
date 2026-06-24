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

      <p v-if="readonly" class="poa-lock-badge" aria-live="polite">
        Practice completed and locked. The POA below is read-only — add a timestamped note instead.
      </p>

      <div class="mode-control" role="group" aria-label="POA entry mode">
        <button
          type="button"
          :class="{ active: draft.mode === 'structured' }"
          :aria-pressed="draft.mode === 'structured'"
          :disabled="readonly"
          @click="draft.mode = 'structured'"
        >
          Structured
        </button>
        <button
          type="button"
          :class="{ active: draft.mode === 'journal' }"
          :aria-pressed="draft.mode === 'journal'"
          :disabled="readonly"
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
              :disabled="readonly"
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
                :disabled="readonly"
                placeholder="Morning observation."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-observe-midday">Observe Midday</label>
              <textarea
                id="poa-observe-midday"
                v-model="draft.observeMidday"
                rows="3"
                :disabled="readonly"
                placeholder="Midday observation."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-observe-evening">Observe Evening</label>
              <textarea
                id="poa-observe-evening"
                v-model="draft.observeEvening"
                rows="3"
                :disabled="readonly"
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
                :disabled="readonly"
                placeholder="Morning application."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-apply-midday">Apply Midday</label>
              <textarea
                id="poa-apply-midday"
                v-model="draft.applyMidday"
                rows="3"
                :disabled="readonly"
                placeholder="Midday application."
              />
            </div>
            <div class="daily-action-field">
              <label for="poa-apply-evening">Apply Evening</label>
              <textarea
                id="poa-apply-evening"
                v-model="draft.applyEvening"
                rows="3"
                :disabled="readonly"
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
          :disabled="readonly"
          placeholder="Optional note for today’s Practice / Observe / Apply work."
        />
      </div>

      <div v-if="!readonly" class="daily-action-footer">
        <ion-button color="primary" @click="saveDailyAction">
          Save Daily Action
        </ion-button>
        <ion-button fill="outline" color="success" @click="completePractice">
          Complete Practice
        </ion-button>
        <p v-if="autosaveState" class="saved-note" aria-live="polite">
          {{ autosaveState }}
        </p>
        <p v-else-if="hasSavedEntry" class="saved-note" aria-live="polite">
          Daily Action saved.
        </p>
      </div>

      <section v-if="readonly" class="post-lock-notes" aria-labelledby="post-lock-notes-title">
        <h3 id="post-lock-notes-title">Notes after completion</h3>
        <p class="poa-copy">
          The POA above is locked. Add short, timestamped reflections without changing it.
        </p>

        <ul v-if="notes.length" class="note-list">
          <li v-for="note in notes" :key="note.id" class="note-item">
            <time :datetime="note.createdAt">{{ formatNoteTime(note.createdAt) }}</time>
            <p>{{ note.note }}</p>
          </li>
        </ul>

        <div class="daily-action-field">
          <label for="post-lock-note-input">Add a note</label>
          <textarea
            id="post-lock-note-input"
            v-model="noteDraft"
            rows="3"
            placeholder="A short reflection to append."
          />
        </div>
        <div class="daily-action-footer">
          <ion-button color="primary" :disabled="!noteDraft.trim()" @click="addNote">
            Add note
          </ion-button>
        </div>
      </section>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader } from '@ionic/vue';
import type { POADraft, POAEntry, POANote } from '@/types/practice';

const AUTOSAVE_DELAY_MS = 1000;

const props = withDefaults(
  defineProps<{
    entry: POAEntry | null;
    readonly?: boolean;
    notes?: POANote[];
  }>(),
  {
    readonly: false,
    notes: () => [],
  },
);

const emit = defineEmits<{
  (event: 'save', payload: POADraft): void;
  (event: 'autosave', payload: POADraft): void;
  (event: 'complete'): void;
  (event: 'add-note', note: string): void;
}>();

const draft = reactive<POADraft>(createDraft(props.entry));
const noteDraft = ref('');
const autosaveState = ref('');
const hasSavedEntry = computed(() => Boolean(props.entry?.updatedAt));

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
// Set when we overwrite the local draft from incoming props, so the resulting
// reactive change does not re-trigger an autosave loop.
let suppressAutosave = false;

watch(
  () => props.entry,
  (entry) => {
    suppressAutosave = true;
    Object.assign(draft, createDraft(entry));
  },
  { deep: true },
);

// A4 AUTOSAVE: debounce edits and emit an autosave so a reload or background
// auth refresh cannot wipe an unsaved draft before the day is locked.
watch(
  draft,
  () => {
    if (suppressAutosave) {
      suppressAutosave = false;
      return;
    }
    if (props.readonly) return;

    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      autosaveState.value = 'Draft autosaved.';
      emit('autosave', { ...draft });
    }, AUTOSAVE_DELAY_MS);
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer);
});

function saveDailyAction(): void {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveState.value = '';
  emit('save', { ...draft });
}

function completePractice(): void {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  emit('complete');
}

function addNote(): void {
  const trimmed = noteDraft.value.trim();
  if (!trimmed) return;
  emit('add-note', trimmed);
  noteDraft.value = '';
}

function formatNoteTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
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

.poa-lock-badge {
  background: rgba(55, 120, 72, 0.12);
  border: 1px solid rgba(55, 120, 72, 0.3);
  border-radius: 16px;
  color: #244a2e;
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.4;
  margin: 0 0 12px;
  padding: 10px 12px;
}

.daily-action-field textarea:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.post-lock-notes {
  border-top: 1px solid rgba(75, 52, 29, 0.16);
  display: grid;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
}

.post-lock-notes h3 {
  color: #2e1c0f;
  font-size: 0.95rem;
  font-weight: 900;
  margin: 0;
}

.note-list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.note-item {
  background: rgba(55, 36, 22, 0.04);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 14px;
  display: grid;
  gap: 4px;
  padding: 10px 12px;
}

.note-item time {
  color: #39764a;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.note-item p {
  color: #372416;
  line-height: 1.45;
  margin: 0;
}

@media (min-width: 720px) {
  .field-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
