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

        <AuthPanel />

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
            Pick My Own opens the highlighted chart area so you can choose a specific parent tool. Tap any chart node for category details and tool filters.
          </p>
        </section>

        <CircleChart
          :selected-category-ids="selectedCategoryIds"
          :tool-filter="selectedToolsByCategory"
          :disabled="isPracticeStarted"
          @toggle-category="toggleCategory"
          @open-category="openCategoryDetail"
        />

        <section class="action-panel" aria-labelledby="chart-actions-title">
          <div class="action-heading">
            <div>
              <p class="eyebrow">Practice pool</p>
              <h2 id="chart-actions-title">Selected chart areas</h2>
            </div>
            <span class="count-badge">{{ selectedCategoryIds.length }} / {{ CHART_CATEGORIES.length }} areas · {{ poolToolCount }} {{ poolToolCount === 1 ? 'tool' : 'tools' }}</span>
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

          <p v-if="selectedCategoryIds.length > 0 && poolToolCount === 0" class="empty-pool-note">
            All parent tools are deselected. Open a chart area’s details to select tools for Draw Random.
          </p>

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

        <CategoryDetailSheet
          :is-open="isDetailOpen"
          :category-id="detailCategoryId"
          :included="isDetailCategoryIncluded"
          :selected-tool-names="detailSelectedToolNames"
          :locked="isPracticeStarted"
          @dismiss="closeCategoryDetail"
          @set-included="setCategoryIncluded"
          @set-selected-tools="setSelectedTools"
          @preview-tool="previewParentTool"
        />

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
import { computed, onMounted, ref, watch } from 'vue';
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
import AuthPanel from '@/components/AuthPanel.vue';
import DailyActionCard from '@/components/DailyActionCard.vue';
import CategoryDetailSheet from '@/components/CategoryDetailSheet.vue';
import CircleChart from '@/components/CircleChart.vue';
import ToolPreviewCard from '@/components/ToolPreviewCard.vue';
import { APP_NAME, BETA_DESCRIPTION, CHART_ATTRIBUTION } from '@/constants/attribution';
import { CHART_CATEGORIES, getFamily, type ChartCategory } from '@/data/circleChartCatalog';
import {
  createAllParentToolFilter,
  createDailyToolSelection,
  createRandomSelectionFromCategories,
  createSelectionForParentTool,
  getFilteredTools,
  type ParentToolFilter,
} from '@/data/toolCatalog';
import { currentUser, loadSession } from '@/stores/authStore';
import {
  clearTodayPracticePreview,
  getLocalDate,
  getPOA,
  getTodayPractice,
  savePOA,
  setPracticeStorageScope,
  setPreview,
  startTodayPractice,
} from '@/stores/dailyPracticeStore';
import type { DailyPractice, POAEntry } from '@/types/practice';

const savedPractice = getTodayPractice();
const selectedCategoryIds = ref<string[]>(CHART_CATEGORIES.map((category) => category.id));
const selectedToolsByCategory = ref<ParentToolFilter>(createAllParentToolFilter());
const previewCategoryId = ref<string | null>(
  savedPractice?.selectedTool.categoryId ?? CHART_CATEGORIES[0]?.id ?? null,
);
const detailCategoryId = ref<string | null>(null);
const isDetailOpen = ref(false);
const currentPractice = ref<DailyPractice | null>(savedPractice);
const poaEntry = ref<POAEntry | null>(savedPractice ? getPOA(savedPractice.id) : null);

const previewCategory = computed<ChartCategory | null>(() => {
  if (!previewCategoryId.value) return null;
  return CHART_CATEGORIES.find((category) => category.id === previewCategoryId.value) ?? null;
});

const isPracticeStarted = computed(() => currentPractice.value?.status === 'started');
const canPickFromPreview = computed(() => !isPracticeStarted.value && Boolean(previewCategory.value));
const poolToolCount = computed(() =>
  selectedCategoryIds.value.reduce(
    (count, categoryId) => count + getFilteredTools(categoryId, selectedToolsByCategory.value).length,
    0,
  ),
);
const canDrawRandom = computed(() => !isPracticeStarted.value && poolToolCount.value > 0);

const isDetailCategoryIncluded = computed(() =>
  Boolean(detailCategoryId.value && selectedCategoryIds.value.includes(detailCategoryId.value)),
);
const detailSelectedToolNames = computed(() =>
  detailCategoryId.value ? selectedToolsByCategory.value[detailCategoryId.value] ?? [] : [],
);

onMounted(() => {
  void loadSession();
});

// Local demo auth: each signed-in user gets their own locally stored
// practice/POA day, so re-read storage whenever the account changes.
watch(currentUser, (user) => {
  setPracticeStorageScope(user?.id ?? null);
  reloadPracticeFromStorage();
});

function reloadPracticeFromStorage(): void {
  const saved = getTodayPractice();
  currentPractice.value = saved;
  poaEntry.value = saved ? getPOA(saved.id) : null;
  isDetailOpen.value = false;

  if (saved) {
    previewCategoryId.value = saved.selectedTool.categoryId;
    ensureCategorySelected(saved.selectedTool.categoryId);
  }
}

function toggleCategory(categoryId: string): void {
  setCategoryIncluded(categoryId, !selectedCategoryIds.value.includes(categoryId));
}

function setCategoryIncluded(categoryId: string, included: boolean): void {
  if (isPracticeStarted.value) return;

  selectedCategoryIds.value = included
    ? [...new Set([...selectedCategoryIds.value, categoryId])]
    : selectedCategoryIds.value.filter((id) => id !== categoryId);

  previewCategoryId.value = categoryId;
  currentPractice.value = null;
  poaEntry.value = null;
  clearTodayPracticePreview();
}

function setSelectedTools(categoryId: string, toolNames: string[]): void {
  if (isPracticeStarted.value) return;

  selectedToolsByCategory.value = { ...selectedToolsByCategory.value, [categoryId]: toolNames };
  currentPractice.value = null;
  poaEntry.value = null;
  clearTodayPracticePreview();
}

function openCategoryDetail(categoryId: string): void {
  previewCategoryId.value = categoryId;
  detailCategoryId.value = categoryId;
  isDetailOpen.value = true;
}

function closeCategoryDetail(): void {
  isDetailOpen.value = false;
}

function selectAllCategories(): void {
  if (isPracticeStarted.value) return;

  selectedCategoryIds.value = CHART_CATEGORIES.map((category) => category.id);
  selectedToolsByCategory.value = createAllParentToolFilter();
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

  openCategoryDetail(previewCategoryId.value);
}

function previewParentTool(categoryId: string, parentToolName: string): void {
  if (isPracticeStarted.value) return;

  const selection = createSelectionForParentTool(categoryId, parentToolName);
  if (!selection) return;

  ensureCategorySelected(categoryId);
  ensureToolSelected(categoryId, parentToolName);
  previewCategoryId.value = categoryId;
  poaEntry.value = null;
  currentPractice.value = setPreview(selection, 'self-selected');
  isDetailOpen.value = false;
}

function drawRandomPractice(): void {
  if (!canDrawRandom.value) return;

  const selection = createRandomSelectionFromCategories(selectedCategoryIds.value, selectedToolsByCategory.value);
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
    openCategoryDetail(currentPractice.value.selectedTool.categoryId);
  }
}

function ensureCategorySelected(categoryId: string): void {
  if (!selectedCategoryIds.value.includes(categoryId)) {
    selectedCategoryIds.value = [...selectedCategoryIds.value, categoryId];
  }
}

function ensureToolSelected(categoryId: string, parentToolName: string): void {
  const current = selectedToolsByCategory.value[categoryId] ?? [];
  if (!current.includes(parentToolName)) {
    selectedToolsByCategory.value = {
      ...selectedToolsByCategory.value,
      [categoryId]: [...current, parentToolName],
    };
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

.empty-pool-note {
  background: rgba(190, 18, 60, 0.07);
  border: 1px solid rgba(190, 18, 60, 0.18);
  border-radius: 16px;
  color: #8c1f3e;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 12px 0 0;
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
