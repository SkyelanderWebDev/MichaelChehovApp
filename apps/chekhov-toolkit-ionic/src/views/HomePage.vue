<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ APP_NAME }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false" class="toolkit-page">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ APP_NAME }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <main class="page-shell">
        <section class="hero-card" aria-labelledby="today-practice-title">
          <p class="eyebrow">Weekend pilot</p>
          <h1 id="today-practice-title">Today’s Practice</h1>
          <p class="hero-copy">
            Choose a chart area, draw from the selected pool, or use the seeded Daily Tool. Preview first; lock only when you press Start Today’s Practice.
          </p>
          <p v-if="isPracticeStarted" class="lock-banner" aria-live="polite">
            Started for {{ currentPractice?.localDate }}. The chart is locked for today’s practice.
          </p>
        </section>

        <section class="entry-panel" aria-labelledby="entry-paths-title">
          <div>
            <p class="eyebrow">Three entry paths</p>
            <h2 id="entry-paths-title">Choose how to begin</h2>
          </div>

          <div class="entry-grid">
            <ion-button fill="outline" color="dark" :disabled="!canPickFromPreview" @click="pickMyOwn">
              Pick My Own
            </ion-button>
            <ion-button color="primary" :disabled="!canDrawRandom" @click="drawRandomPractice">
              Draw Random
            </ion-button>
            <ion-button fill="outline" color="tertiary" :disabled="isPracticeStarted" @click="chooseDailyTool">
              Daily Tool
            </ion-button>
          </div>

          <p class="entry-note">
            Pick My Own uses the highlighted chart area for this slice. Full category drill-down is the next planned pass.
          </p>
        </section>

        <CircleChart
          :selected-category-ids="selectedCategoryIds"
          :disabled="isPracticeStarted"
          @toggle-category="toggleCategory"
        />

        <section class="action-panel" aria-labelledby="chart-actions-title">
          <div class="action-heading">
            <div>
              <p class="eyebrow">Practice pool</p>
              <h2 id="chart-actions-title">Selected chart areas</h2>
            </div>
            <span class="count-badge">{{ selectedCategoryIds.length }} / {{ CHART_CATEGORIES.length }}</span>
          </div>

          <div class="button-row">
            <ion-button fill="outline" color="medium" :disabled="isPracticeStarted" @click="selectAllCategories">
              Select all
            </ion-button>
            <ion-button fill="clear" color="medium" :disabled="isPracticeStarted" @click="clearCategories">
              Clear
            </ion-button>
            <ion-button color="primary" :disabled="!canDrawRandom" @click="drawRandomPractice">
              Draw random preview
            </ion-button>
          </div>

          <ToolPreviewCard
            v-if="currentPractice"
            :practice="currentPractice"
            @start="startPractice"
            @change="focusSelectedCategory"
            @reroll="drawRandomPractice"
          />

          <ion-card v-else-if="previewCategory" class="preview-card">
            <ion-card-header>
              <ion-card-subtitle>{{ getFamily(previewCategory.family).label }}</ion-card-subtitle>
              <ion-card-title>{{ previewCategory.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ previewCategory.toolCount }} tool{{ previewCategory.toolCount === 1 ? '' : 's' }} available in this chart area.</p>
              <p class="neutral-note">Neutral chart-area preview only. Choose an entry path to create today’s practice preview.</p>
            </ion-card-content>
          </ion-card>

          <p v-else class="empty-state">
            Select a chart area or use Daily Tool to preview today’s practice.
          </p>

          <DailyActionCard
            v-if="isPracticeStarted"
            :entry="poaEntry"
            @save="saveDailyAction"
          />
        </section>

        <footer class="attribution-card">
          <strong>{{ APP_NAME }}</strong>
          <p>{{ BETA_DESCRIPTION }}</p>
          <p>{{ CHART_ATTRIBUTION }}</p>
        </footer>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import DailyActionCard from '@/components/DailyActionCard.vue';
import CircleChart from '@/components/CircleChart.vue';
import ToolPreviewCard from '@/components/ToolPreviewCard.vue';
import { APP_NAME, BETA_DESCRIPTION, CHART_ATTRIBUTION } from '@/constants/attribution';
import { CHART_CATEGORIES, getFamily, type ChartCategory } from '@/data/circleChartCatalog';
import {
  createDailyToolSelection,
  createFirstSelectionForCategory,
  createRandomSelectionFromCategories,
} from '@/data/toolCatalog';
import {
  clearTodayPracticePreview,
  getLocalDate,
  getPOA,
  getTodayPractice,
  savePOA,
  setPreview,
  startTodayPractice,
} from '@/stores/dailyPracticeStore';
import type { DailyPractice, POAEntry } from '@/types/practice';

const savedPractice = getTodayPractice();
const selectedCategoryIds = ref<string[]>(CHART_CATEGORIES.map((category) => category.id));
const previewCategoryId = ref<string | null>(
  savedPractice?.selectedTool.categoryId ?? CHART_CATEGORIES[0]?.id ?? null,
);
const currentPractice = ref<DailyPractice | null>(savedPractice);
const poaEntry = ref<POAEntry | null>(savedPractice ? getPOA(savedPractice.id) : null);

const previewCategory = computed<ChartCategory | null>(() => {
  if (!previewCategoryId.value) return null;
  return CHART_CATEGORIES.find((category) => category.id === previewCategoryId.value) ?? null;
});

const isPracticeStarted = computed(() => currentPractice.value?.status === 'started');
const canPickFromPreview = computed(() => !isPracticeStarted.value && Boolean(previewCategory.value));
const canDrawRandom = computed(() => !isPracticeStarted.value && selectedCategoryIds.value.length > 0);

function toggleCategory(categoryId: string): void {
  if (isPracticeStarted.value) return;

  const alreadySelected = selectedCategoryIds.value.includes(categoryId);
  selectedCategoryIds.value = alreadySelected
    ? selectedCategoryIds.value.filter((id) => id !== categoryId)
    : [...selectedCategoryIds.value, categoryId];

  previewCategoryId.value = categoryId;
  currentPractice.value = null;
  poaEntry.value = null;
  clearTodayPracticePreview();
}

function selectAllCategories(): void {
  if (isPracticeStarted.value) return;

  selectedCategoryIds.value = CHART_CATEGORIES.map((category) => category.id);
  previewCategoryId.value = selectedCategoryIds.value[0] ?? null;
  currentPractice.value = null;
  poaEntry.value = null;
  clearTodayPracticePreview();
}

function clearCategories(): void {
  if (isPracticeStarted.value) return;

  selectedCategoryIds.value = [];
  previewCategoryId.value = null;
  currentPractice.value = null;
  poaEntry.value = null;
  clearTodayPracticePreview();
}

function pickMyOwn(): void {
  if (isPracticeStarted.value || !previewCategoryId.value) return;

  const selection = createFirstSelectionForCategory(previewCategoryId.value);
  if (!selection) return;

  ensureCategorySelected(selection.categoryId);
  poaEntry.value = null;
  currentPractice.value = setPreview(selection, 'self-selected');
}

function drawRandomPractice(): void {
  if (!canDrawRandom.value) return;

  const selection = createRandomSelectionFromCategories(selectedCategoryIds.value);
  if (!selection) return;

  previewCategoryId.value = selection.categoryId;
  ensureCategorySelected(selection.categoryId);
  poaEntry.value = null;
  currentPractice.value = setPreview(selection, 'random');
}

function chooseDailyTool(): void {
  if (isPracticeStarted.value) return;

  const selection = createDailyToolSelection(getLocalDate());
  previewCategoryId.value = selection.categoryId;
  ensureCategorySelected(selection.categoryId);
  poaEntry.value = null;
  currentPractice.value = setPreview(selection, 'global-daily');
}

function startPractice(): void {
  const startedPractice = startTodayPractice();
  if (startedPractice) {
    currentPractice.value = startedPractice;
    poaEntry.value = getPOA(startedPractice.id);
  }
}

function saveDailyAction(journalText: string): void {
  const practice = currentPractice.value;
  if (!practice || practice.status !== 'started') return;

  poaEntry.value = savePOA({
    dailyPracticeId: practice.id,
    mode: 'journal',
    practiceNotes: '',
    observeMorning: '',
    observeMidday: '',
    observeEvening: '',
    applyMorning: '',
    applyMidday: '',
    applyEvening: '',
    journalText,
  });

  currentPractice.value = getTodayPractice(practice.localDate) ?? practice;
}

function focusSelectedCategory(): void {
  if (currentPractice.value) {
    previewCategoryId.value = currentPractice.value.selectedTool.categoryId;
  }
}

function ensureCategorySelected(categoryId: string): void {
  if (!selectedCategoryIds.value.includes(categoryId)) {
    selectedCategoryIds.value = [...selectedCategoryIds.value, categoryId];
  }
}
</script>

<style scoped>
.toolkit-page {
  --background: #f6efe3;
}

.page-shell {
  display: grid;
  gap: 18px;
  margin: 0 auto;
  max-width: 860px;
  padding: 18px 14px 28px;
}

.hero-card,
.entry-panel,
.action-panel,
.attribution-card {
  background: rgba(255, 253, 247, 0.92);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(65, 43, 22, 0.12);
  color: #372416;
  padding: 18px;
}

.eyebrow {
  color: #8a5c25;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.hero-card h1,
.entry-panel h2,
.action-heading h2 {
  color: #2e1c0f;
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.04;
  margin: 0;
}

.hero-card h1 {
  font-size: clamp(2rem, 9vw, 3.5rem);
}

.entry-panel h2,
.action-heading h2 {
  font-size: clamp(1.35rem, 6vw, 2rem);
}

.hero-copy,
.entry-note {
  color: rgba(55, 36, 22, 0.72);
  font-size: 1rem;
  line-height: 1.5;
  margin: 10px 0 0;
}

.lock-banner {
  background: rgba(55, 120, 72, 0.12);
  border: 1px solid rgba(55, 120, 72, 0.22);
  border-radius: 16px;
  color: #244a2e;
  font-weight: 800;
  line-height: 1.35;
  margin: 14px 0 0;
  padding: 12px;
}

.entry-panel {
  display: grid;
  gap: 14px;
}

.entry-grid,
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.entry-grid ion-button,
.button-row ion-button {
  min-height: 44px;
}

.entry-note {
  background: rgba(55, 36, 22, 0.05);
  border-radius: 16px;
  font-size: 0.9rem;
  margin: 0;
  padding: 12px;
}

.action-heading {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 14px;
}

.count-badge {
  background: rgba(55, 36, 22, 0.08);
  border-radius: 999px;
  color: #5b3a17;
  flex: 0 0 auto;
  font-size: 0.78rem;
  font-weight: 900;
  padding: 8px 10px;
}

.preview-card {
  --background: #fff8e8;
  border: 1px solid rgba(138, 92, 36, 0.18);
  box-shadow: none;
  margin: 16px 0 0;
}

.preview-card ion-card-subtitle {
  color: #8a5c25;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.preview-card ion-card-title {
  color: #2e1c0f;
  font-family: Georgia, 'Times New Roman', serif;
}

.preview-card p,
.empty-state,
.attribution-card p {
  color: rgba(55, 36, 22, 0.72);
  line-height: 1.45;
}

.neutral-note {
  font-size: 0.9rem;
  font-weight: 700;
}

.empty-state {
  background: rgba(55, 36, 22, 0.05);
  border-radius: 16px;
  margin: 14px 0 0;
  padding: 12px;
}

.attribution-card {
  font-size: 0.84rem;
}

.attribution-card strong {
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
  margin-bottom: 8px;
}

.attribution-card p {
  margin: 6px 0 0;
}

@media (min-width: 760px) {
  .page-shell {
    gap: 22px;
    padding: 28px 20px 40px;
  }

  .hero-card,
  .entry-panel,
  .action-panel,
  .attribution-card {
    padding: 24px;
  }
}
</style>
