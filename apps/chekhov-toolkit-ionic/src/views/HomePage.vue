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
          <p class="eyebrow">Secure tester beta</p>
          <h1 id="today-practice-title">Today’s Practice</h1>
          <p class="hero-copy">
            Sign in with the tester account panel, then choose a chart area, draw from the selected pool, or use the seeded Daily Tool. Preview first; lock only when you press Start Today’s Practice.
          </p>
          <p v-if="!isSignedIn && authStatus !== 'unknown'" class="lock-banner" aria-live="polite">
            Supabase sign-in is required before Today’s Practice and POA can be saved for beta testing.
          </p>
          <p v-if="practiceLoadError" class="error-banner" role="alert">{{ practiceLoadError }}</p>
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
            <ion-button fill="outline" color="tertiary" :disabled="!canChooseDailyTool" @click="chooseDailyTool">
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
          :disabled="practiceControlsDisabled"
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
            <ion-button fill="outline" color="medium" :disabled="practiceControlsDisabled" @click="selectAllCategories">
              Select all
            </ion-button>
            <ion-button fill="clear" color="medium" :disabled="practiceControlsDisabled" @click="clearCategories">
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
          :locked="practiceControlsDisabled"
          @dismiss="closeCategoryDetail"
          @set-included="setCategoryIncluded"
          @set-selected-tools="setSelectedTools"
          @preview-tool="previewParentTool"
        />

        <section class="feedback-panel" aria-labelledby="feedback-title">
          <div>
            <p class="eyebrow">Tester feedback</p>
            <h2 id="feedback-title">Send a beta note</h2>
          </div>
          <p class="feedback-copy">
            Use this for tester friction, phone-install issues, or POA/practice flow notes. Feedback is saved to your Supabase account.
          </p>
          <label class="feedback-label" for="beta-feedback">Feedback</label>
          <textarea
            id="beta-feedback"
            v-model="feedbackText"
            class="feedback-textarea"
            rows="4"
            :disabled="!isSignedIn || practiceBusy"
            placeholder="What should Dawson/Lisa know from this test?"
          ></textarea>
          <div class="button-row">
            <ion-button color="dark" :disabled="!canSubmitFeedback" @click="submitBetaFeedback">
              Send feedback
            </ion-button>
          </div>
          <p v-if="feedbackStatus" class="feedback-status" role="status">{{ feedbackStatus }}</p>
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
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import {
  clearTodayPracticePreview,
  getLocalDate,
  getPOA,
  getTodayPractice,
  savePOA,
  setPreview,
  startTodayPractice,
  submitFeedback,
} from '@/stores/dailyPracticeStore';
import type { DailyPractice, POAEntry } from '@/types/practice';

const selectedCategoryIds = ref<string[]>(CHART_CATEGORIES.map((category) => category.id));
const selectedToolsByCategory = ref<ParentToolFilter>(createAllParentToolFilter());
const previewCategoryId = ref<string | null>(CHART_CATEGORIES[0]?.id ?? null);
const detailCategoryId = ref<string | null>(null);
const isDetailOpen = ref(false);
const currentPractice = ref<DailyPractice | null>(null);
const poaEntry = ref<POAEntry | null>(null);
const practiceLoadError = ref<string | null>(null);
const practiceBusy = ref(false);
const feedbackText = ref('');
const feedbackStatus = ref<string | null>(null);

const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));
const practiceControlsDisabled = computed(() => !isSignedIn.value || practiceBusy.value || isPracticeStarted.value);

const previewCategory = computed<ChartCategory | null>(() => {
  if (!previewCategoryId.value) return null;
  return CHART_CATEGORIES.find((category) => category.id === previewCategoryId.value) ?? null;
});

const isPracticeStarted = computed(() => currentPractice.value?.status === 'started');
const canPickFromPreview = computed(() => !practiceControlsDisabled.value && Boolean(previewCategory.value));
const poolToolCount = computed(() =>
  selectedCategoryIds.value.reduce(
    (count, categoryId) => count + getFilteredTools(categoryId, selectedToolsByCategory.value).length,
    0,
  ),
);
const canDrawRandom = computed(() => !practiceControlsDisabled.value && poolToolCount.value > 0);
const canChooseDailyTool = computed(() => !practiceControlsDisabled.value);
const canSubmitFeedback = computed(() => isSignedIn.value && !practiceBusy.value && feedbackText.value.trim().length > 0);

const isDetailCategoryIncluded = computed(() =>
  Boolean(detailCategoryId.value && selectedCategoryIds.value.includes(detailCategoryId.value)),
);
const detailSelectedToolNames = computed(() =>
  detailCategoryId.value ? selectedToolsByCategory.value[detailCategoryId.value] ?? [] : [],
);

onMounted(async () => {
  await loadSession();
  await reloadPracticeFromSupabase();
});

watch(currentUser, () => {
  void reloadPracticeFromSupabase();
});

async function reloadPracticeFromSupabase(): Promise<void> {
  practiceLoadError.value = null;

  if (!isSignedIn.value) {
    currentPractice.value = null;
    poaEntry.value = null;
    isDetailOpen.value = false;
    return;
  }

  practiceBusy.value = true;
  try {
    const saved = await getTodayPractice();
    currentPractice.value = saved;
    poaEntry.value = saved ? await getPOA(saved.id) : null;
    isDetailOpen.value = false;

    if (saved) {
      previewCategoryId.value = saved.selectedTool.categoryId;
      ensureCategorySelected(saved.selectedTool.categoryId);
    }
  } catch (error) {
    setPracticeError(error, 'Unable to load Today’s Practice from Supabase.');
  } finally {
    practiceBusy.value = false;
  }
}

async function toggleCategory(categoryId: string): Promise<void> {
  await setCategoryIncluded(categoryId, !selectedCategoryIds.value.includes(categoryId));
}

async function setCategoryIncluded(categoryId: string, included: boolean): Promise<void> {
  if (practiceControlsDisabled.value) return;

  selectedCategoryIds.value = included
    ? [...new Set([...selectedCategoryIds.value, categoryId])]
    : selectedCategoryIds.value.filter((id) => id !== categoryId);

  previewCategoryId.value = categoryId;
  await clearPreviewState();
}

async function setSelectedTools(categoryId: string, toolNames: string[]): Promise<void> {
  if (practiceControlsDisabled.value) return;

  selectedToolsByCategory.value = { ...selectedToolsByCategory.value, [categoryId]: toolNames };
  await clearPreviewState();
}

function openCategoryDetail(categoryId: string): void {
  previewCategoryId.value = categoryId;
  detailCategoryId.value = categoryId;
  isDetailOpen.value = true;
}

function closeCategoryDetail(): void {
  isDetailOpen.value = false;
}

async function selectAllCategories(): Promise<void> {
  if (practiceControlsDisabled.value) return;

  selectedCategoryIds.value = CHART_CATEGORIES.map((category) => category.id);
  selectedToolsByCategory.value = createAllParentToolFilter();
  previewCategoryId.value = selectedCategoryIds.value[0] ?? null;
  await clearPreviewState();
}

async function clearCategories(): Promise<void> {
  if (practiceControlsDisabled.value) return;

  selectedCategoryIds.value = [];
  previewCategoryId.value = null;
  await clearPreviewState();
}

function pickMyOwn(): void {
  if (!canPickFromPreview.value || !previewCategoryId.value) return;

  openCategoryDetail(previewCategoryId.value);
}

async function previewParentTool(categoryId: string, parentToolName: string): Promise<void> {
  if (practiceControlsDisabled.value) return;

  const selection = createSelectionForParentTool(categoryId, parentToolName);
  if (!selection) return;

  await withPracticeOperation(async () => {
    ensureCategorySelected(categoryId);
    ensureToolSelected(categoryId, parentToolName);
    previewCategoryId.value = categoryId;
    poaEntry.value = null;
    currentPractice.value = await setPreview(selection, 'self-selected');
    isDetailOpen.value = false;
  });
}

async function drawRandomPractice(): Promise<void> {
  if (!canDrawRandom.value) return;

  const selection = createRandomSelectionFromCategories(selectedCategoryIds.value, selectedToolsByCategory.value);
  if (!selection) return;

  await withPracticeOperation(async () => {
    previewCategoryId.value = selection.categoryId;
    ensureCategorySelected(selection.categoryId);
    poaEntry.value = null;
    currentPractice.value = await setPreview(selection, 'random');
  });
}

async function chooseDailyTool(): Promise<void> {
  if (!canChooseDailyTool.value) return;

  const selection = createDailyToolSelection(getLocalDate());

  await withPracticeOperation(async () => {
    previewCategoryId.value = selection.categoryId;
    ensureCategorySelected(selection.categoryId);
    poaEntry.value = null;
    currentPractice.value = await setPreview(selection, 'global-daily');
  });
}

async function startPractice(): Promise<void> {
  await withPracticeOperation(async () => {
    const startedPractice = await startTodayPractice();
    if (startedPractice) {
      currentPractice.value = startedPractice;
      poaEntry.value = await getPOA(startedPractice.id);
    }
  });
}

async function saveDailyAction(journalText: string): Promise<void> {
  const practice = currentPractice.value;
  if (!practice || practice.status !== 'started') return;

  await withPracticeOperation(async () => {
    poaEntry.value = await savePOA({
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

    currentPractice.value = (await getTodayPractice(practice.localDate)) ?? practice;
  });
}

async function submitBetaFeedback(): Promise<void> {
  const message = feedbackText.value.trim();
  if (!message) return;

  await withPracticeOperation(async () => {
    await submitFeedback(message, {
      localDate: getLocalDate(),
      practiceId: currentPractice.value?.id ?? null,
      source: 'in-app-beta-feedback',
    });
    feedbackText.value = '';
    feedbackStatus.value = 'Feedback saved. Thank you.';
  });
}

function focusSelectedCategory(): void {
  if (currentPractice.value) {
    openCategoryDetail(currentPractice.value.selectedTool.categoryId);
  }
}

async function clearPreviewState(): Promise<void> {
  currentPractice.value = null;
  poaEntry.value = null;

  try {
    await clearTodayPracticePreview();
  } catch (error) {
    setPracticeError(error, 'Unable to clear the Supabase preview row.');
  }
}

async function withPracticeOperation(operation: () => Promise<void>): Promise<void> {
  if (!isSignedIn.value) {
    practiceLoadError.value = 'Sign in before saving Today’s Practice or POA.';
    return;
  }

  practiceBusy.value = true;
  practiceLoadError.value = null;
  try {
    await operation();
  } catch (error) {
    setPracticeError(error, 'Unable to save Today’s Practice in Supabase.');
  } finally {
    practiceBusy.value = false;
  }
}

function setPracticeError(error: unknown, fallback: string): void {
  practiceLoadError.value = error instanceof Error ? error.message : fallback;
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
.feedback-panel,
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

.lock-banner,
.error-banner {
  background: rgba(55, 120, 72, 0.12);
  border: 1px solid rgba(55, 120, 72, 0.22);
  border-radius: 16px;
  color: #244a2e;
  font-weight: 800;
  line-height: 1.35;
  margin: 14px 0 0;
  padding: 12px;
}

.error-banner {
  background: rgba(190, 18, 60, 0.08);
  border-color: rgba(190, 18, 60, 0.2);
  color: #8c1f3e;
}

.entry-panel {
  display: grid;
  gap: 14px;
}

.feedback-panel {
  display: grid;
  gap: 10px;
}

.feedback-copy,
.feedback-status {
  color: rgba(55, 36, 22, 0.72);
  font-size: 0.95rem;
  line-height: 1.45;
  margin: 0;
}

.feedback-label {
  color: #372416;
  font-size: 0.84rem;
  font-weight: 900;
}

.feedback-textarea {
  background: rgba(55, 36, 22, 0.04);
  border: 1px solid rgba(75, 52, 29, 0.22);
  border-radius: 14px;
  color: #372416;
  font: inherit;
  min-height: 96px;
  padding: 10px 12px;
  resize: vertical;
  width: 100%;
}

.feedback-textarea:focus {
  border-color: rgba(138, 92, 36, 0.6);
  box-shadow: 0 0 0 3px rgba(138, 92, 36, 0.14);
  outline: none;
}

.feedback-status {
  color: #244a2e;
  font-weight: 800;
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
  .feedback-panel,
  .attribution-card {
    padding: 24px;
  }
}
</style>
