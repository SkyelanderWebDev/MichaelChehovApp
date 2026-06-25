<template>
  <ion-page>
    <ion-content class="history-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Your practice</p>
          <h1>History</h1>
          <p class="page-subtitle">
            A read-only look back at past days — each locked POA, every draw you logged, and notes added after completion.
          </p>
        </header>

        <p v-if="loadError" class="error-banner" role="alert">{{ loadError }}</p>

        <section v-if="authStatus === 'unknown'" class="studio-panel" aria-label="Checking session">
          <p class="panel-copy">Checking your session…</p>
        </section>

        <section v-else-if="!isSignedIn" class="studio-panel" aria-labelledby="history-gate-title">
          <p class="kicker">Private beta</p>
          <h2 id="history-gate-title">Tester access</h2>
          <p class="panel-copy">Tester access is required to view your saved practice history.</p>
        </section>

        <section v-else-if="!isLoading && days.length === 0" class="studio-panel" aria-label="No history yet">
          <p class="panel-copy">
            No past practice days yet. Draw and start a practice on the Journal tab; it will appear here.
          </p>
        </section>

        <ul v-else class="history-list">
          <li v-for="day in days" :key="day.practice.id" class="studio-panel history-day">
            <div class="day-head">
              <div>
                <p class="kicker">{{ day.practice.localDate }} · {{ sourceLabel(day.practice.source) }}</p>
                <h2>{{ toolTitle(day) }}</h2>
                <p class="panel-copy day-sub">{{ day.practice.selectedTool.categoryName }}</p>
              </div>
              <span class="status-pill">{{ statusLabel(day.practice.status) }}</span>
            </div>

            <button
              class="reveal-toggle"
              type="button"
              :aria-expanded="isRevealOpen(day.practice.id)"
              @click="toggleReveal(day.practice.id)"
            >
              {{ isRevealOpen(day.practice.id) ? 'Hide reveal' : 'Reopen the reveal' }}
            </button>

            <dl v-if="isRevealOpen(day.practice.id)" class="reveal-details">
              <div>
                <dt>Chart area</dt>
                <dd>{{ day.practice.selectedTool.categoryName }}</dd>
              </div>
              <div v-if="day.practice.selectedTool.parentToolName">
                <dt>Parent tool</dt>
                <dd>{{ day.practice.selectedTool.parentToolName }}</dd>
              </div>
              <div v-if="day.practice.selectedTool.childToolName">
                <dt>Tool seed</dt>
                <dd>{{ day.practice.selectedTool.childToolName }}</dd>
              </div>
              <div v-for="component in day.practice.selectedTool.components ?? []" :key="component.label">
                <dt>{{ component.label }}</dt>
                <dd>{{ component.value }}</dd>
              </div>
              <div v-if="day.practice.selectedTool.scaleValue">
                <dt>Tempo #</dt>
                <dd>{{ day.practice.selectedTool.scaleValue }}</dd>
              </div>
              <div v-if="day.practice.selectedTool.unveiledValue">
                <dt>Veiling</dt>
                <dd>{{ day.practice.selectedTool.unveiledValue }}</dd>
              </div>
            </dl>

            <section v-if="day.poa" class="day-block" aria-label="Locked POA">
              <h3>POA ({{ day.poa.mode === 'structured' ? 'Structured' : 'Free response' }})</h3>
              <dl v-if="day.poa.mode === 'structured'" class="poa-readout">
                <div v-for="field in structuredFields(day.poa)" :key="field.label">
                  <dt>{{ field.label }}</dt>
                  <dd>{{ field.value }}</dd>
                </div>
              </dl>
              <p v-else class="poa-freetext">{{ day.poa.journalText || '—' }}</p>
            </section>

            <section v-if="day.draws.length" class="day-block" aria-label="Draw history">
              <h3>Draw log ({{ day.draws.length }})</h3>
              <ul class="draw-list">
                <li v-for="draw in day.draws" :key="draw.id">
                  <span class="draw-tool">{{ drawTitle(draw) }}</span>
                  <span class="draw-meta">{{ sourceLabel(draw.source) }} · {{ formatTime(draw.drawnAt) }}</span>
                </li>
              </ul>
            </section>

            <section v-if="day.notes.length" class="day-block" aria-label="Post-completion notes">
              <h3>Notes after completion</h3>
              <ul class="note-list">
                <li v-for="note in day.notes" :key="note.id">
                  <time :datetime="note.createdAt">{{ formatTime(note.createdAt) }}</time>
                  <p>{{ note.note }}</p>
                </li>
              </ul>
            </section>
          </li>
        </ul>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import { getPracticeHistory } from '@/stores/dailyPracticeStore';
import type {
  DrawHistoryEntry,
  POAEntry,
  PracticeHistoryDay,
  PracticeSource,
  PracticeStatus,
} from '@/types/practice';

const days = ref<PracticeHistoryDay[]>([]);
const openReveals = ref<Set<string>>(new Set());
const loadError = ref<string | null>(null);
const isLoading = ref(true);

const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));

const sourceLabels: Record<PracticeSource, string> = {
  'self-selected': 'Picked',
  random: 'Drawn',
  'global-daily': 'Daily tool',
};

const statusLabels: Record<PracticeStatus, string> = {
  preview: 'Preview',
  started: 'Started',
  completed: 'Completed',
};

onMounted(async () => {
  await loadSession();
  await loadHistory();
});

watch(currentUser, () => {
  void loadHistory();
});

async function loadHistory(): Promise<void> {
  loadError.value = null;

  if (!isSignedIn.value) {
    days.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    days.value = await getPracticeHistory();
  } catch {
    loadError.value = 'Unable to load your practice history.';
  } finally {
    isLoading.value = false;
  }
}

function toggleReveal(id: string): void {
  const next = new Set(openReveals.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  openReveals.value = next;
}

function isRevealOpen(id: string): boolean {
  return openReveals.value.has(id);
}

function sourceLabel(source: PracticeSource): string {
  return sourceLabels[source];
}

function statusLabel(status: PracticeStatus): string {
  return statusLabels[status];
}

function toolTitle(day: PracticeHistoryDay): string {
  const tool = day.practice.selectedTool;
  return tool.components?.length ? tool.categoryName : tool.parentToolName;
}

function drawTitle(draw: DrawHistoryEntry): string {
  const tool = draw.selectedTool;
  return tool.components?.length ? tool.categoryName : tool.parentToolName;
}

function structuredFields(poa: POAEntry): Array<{ label: string; value: string }> {
  return [
    { label: 'Practice', value: poa.practiceNotes },
    { label: 'Observe — Morning', value: poa.observeMorning },
    { label: 'Observe — Midday', value: poa.observeMidday },
    { label: 'Observe — Evening', value: poa.observeEvening },
    { label: 'Apply — Morning', value: poa.applyMorning },
    { label: 'Apply — Midday', value: poa.applyMidday },
    { label: 'Apply — Evening', value: poa.applyEvening },
  ].filter((field) => field.value.trim().length > 0);
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
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
  margin: 0;
  padding: 12px 14px;
}

.history-list {
  display: grid;
  gap: 14px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.history-day {
  display: grid;
  gap: 12px;
}

.day-head {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.day-head h2 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 5vw, 1.5rem);
  font-weight: 600;
  line-height: 1.08;
  margin: 4px 0 0;
}

.day-sub {
  margin: 4px 0 0;
}

.reveal-toggle {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 800;
  justify-self: start;
  min-height: 40px;
  padding: 8px 14px;
}

.reveal-details,
.poa-readout {
  display: grid;
  gap: 8px;
  margin: 0;
}

.reveal-details dt,
.poa-readout dt {
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.reveal-details dd,
.poa-readout dd {
  color: var(--text-primary);
  line-height: 1.4;
  margin: 2px 0 0;
}

.day-block {
  border-top: 1px solid var(--border-subtle);
  display: grid;
  gap: 8px;
  padding-top: 10px;
}

.day-block h3 {
  color: var(--text-primary);
  font-size: 0.92rem;
  font-weight: 900;
  margin: 0;
}

.poa-freetext {
  color: var(--text-primary);
  line-height: 1.45;
  margin: 0;
  white-space: pre-wrap;
}

.draw-list,
.note-list {
  display: grid;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.draw-list li {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  justify-content: space-between;
}

.draw-tool {
  color: var(--text-primary);
  font-weight: 800;
}

.draw-meta {
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
}

.note-list li {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  display: grid;
  gap: 4px;
  padding: 10px 12px;
}

.note-list time {
  color: var(--accent-primary);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.note-list p {
  color: var(--text-primary);
  line-height: 1.45;
  margin: 0;
}
</style>
