<template>
  <ion-page>
    <ion-content class="journal-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Today’s Practice</p>
          <h1>Journal</h1>
          <p class="page-subtitle">
            Choose one tool for today’s work. Begin when you’re ready; return to POA throughout the day.
          </p>
        </header>

        <p v-if="practiceLoadError" class="error-banner" role="alert">{{ practiceLoadError }}</p>
        <p v-if="isPracticeStarted" class="lock-banner" aria-live="polite">
          Started for {{ currentPractice?.localDate }}. Today’s tool is locked — return to POA below.
        </p>

        <section v-if="authStatus === 'unknown'" class="studio-panel" aria-label="Checking session">
          <p class="panel-copy">Checking your session…</p>
        </section>

        <section
          v-else-if="!isSignedIn"
          class="studio-panel access-gate"
          aria-labelledby="tester-gate-title"
        >
          <p class="kicker">Private beta</p>
          <h2 id="tester-gate-title">Tester access</h2>
          <p class="panel-copy">Tester access is required to save today’s practice and POA.</p>
          <p v-if="authStatus === 'misconfigured'" class="panel-copy">
            Tester access isn’t available in this build yet. Details are in Settings → Beta data &amp; security.
          </p>
          <ion-button
            v-else
            class="open-tester-access"
            color="primary"
            @click="isAccessSheetOpen = true"
          >
            Get tester access
          </ion-button>
        </section>

        <section class="entry-panel" aria-labelledby="entry-paths-title">
          <div>
            <p class="kicker">Three entry paths</p>
            <h2 id="entry-paths-title">Choose how to begin</h2>
          </div>

          <div class="route-grid">
            <PracticeRouteCard
              title="Pick My Own"
              description="Open a chart area and choose a specific parent tool."
              :icon="handLeftOutline"
              :disabled="!canPickFromPreview"
              @select="pickMyOwn"
            />
            <PracticeRouteCard
              title="Draw Random"
              description="Draw a preview from your selected practice pool."
              :icon="shuffleOutline"
              :disabled="!canDrawRandom"
              @select="drawRandomPractice"
            />
            <PracticeRouteCard
              title="Daily Tool"
              description="Use today’s seeded tool from the full chart."
              :icon="todayOutline"
              :disabled="!canChooseDailyTool"
              @select="chooseDailyTool"
            />
          </div>
        </section>

        <ToolPreviewCard
          v-if="currentPractice"
          :practice="currentPractice"
          @start="startPractice"
          @change="focusSelectedCategory"
          @reroll="drawRandomPractice"
        />

        <p v-else-if="isSignedIn" class="empty-state">
          No practice selected yet. Use an entry path above to preview today’s tool.
        </p>

        <DailyActionCard
          v-if="isPracticeStarted"
          :entry="poaEntry"
          @save="saveDailyAction"
        />

        <section class="studio-panel pool-panel" aria-labelledby="pool-title">
          <div class="pool-heading">
            <div>
              <p class="kicker">Practice pool</p>
              <h2 id="pool-title">Chart areas for Draw Random</h2>
            </div>
            <span class="status-pill">
              {{ selectedCategoryIds.length }} / {{ CHART_CATEGORIES.length }} areas · {{ poolToolCount }} {{ poolToolCount === 1 ? 'tool' : 'tools' }}
            </span>
          </div>

          <div class="button-row">
            <ion-button size="small" fill="outline" color="medium" :disabled="practiceControlsDisabled" @click="selectAllCategories">
              Select all
            </ion-button>
            <ion-button size="small" fill="clear" color="medium" :disabled="practiceControlsDisabled" @click="clearCategories">
              Clear
            </ion-button>
            <ion-button size="small" fill="outline" color="medium" :disabled="practiceControlsDisabled" @click="isPoolOpen = !isPoolOpen">
              {{ isPoolOpen ? 'Hide areas' : 'Adjust areas' }}
            </ion-button>
          </div>

          <p v-if="selectedCategoryIds.length > 0 && poolToolCount === 0" class="empty-pool-note">
            All parent tools are deselected. Open a chart area’s details to select tools for Draw Random.
          </p>

          <ul v-if="isPoolOpen" class="pool-list">
            <li v-for="category in CHART_CATEGORIES" :key="category.id" class="pool-row" :class="{ selected: isCategorySelected(category.id) }">
              <button
                class="pool-toggle"
                type="button"
                :aria-pressed="isCategorySelected(category.id)"
                :aria-label="`${category.name}: ${isCategorySelected(category.id) ? 'remove from' : 'add to'} practice pool`"
                :disabled="practiceControlsDisabled"
                @click="toggleCategory(category.id)"
              >
                <span class="family-dot" :style="{ backgroundColor: getFamily(category.family).color }"></span>
                <span class="pool-name">{{ category.name }}</span>
                <span class="pool-meta">
                  {{ getFamily(category.family).label }} · {{ categoryPoolCount(category) }} of {{ category.toolCount }} tools in pool
                </span>
              </button>
              <button
                class="pool-details"
                type="button"
                aria-haspopup="dialog"
                :aria-label="`Open ${category.name} details`"
                :disabled="practiceControlsDisabled"
                @click="openCategoryDetail(category.id)"
              >
                Details
              </button>
            </li>
          </ul>

          <p class="panel-copy pool-footnote">
            Browse the full Chart of Inspired Action on the Chart tab.
          </p>
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

        <TesterAccessSheet :is-open="isAccessSheetOpen" @dismiss="isAccessSheetOpen = false" />

        <button class="feedback-nudge" type="button" @click="router.push('/settings')">
          Have beta feedback? Share it in Settings →
        </button>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import { handLeftOutline, shuffleOutline, todayOutline } from 'ionicons/icons';
import CategoryDetailSheet from '@/components/CategoryDetailSheet.vue';
import DailyActionCard from '@/components/DailyActionCard.vue';
import PracticeRouteCard from '@/components/PracticeRouteCard.vue';
import TesterAccessSheet from '@/components/TesterAccessSheet.vue';
import ToolPreviewCard from '@/components/ToolPreviewCard.vue';
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
} from '@/stores/dailyPracticeStore';
import type { DailyPractice, POADraft, POAEntry } from '@/types/practice';

const router = useRouter();

const selectedCategoryIds = ref<string[]>(CHART_CATEGORIES.map((category) => category.id));
const selectedToolsByCategory = ref<ParentToolFilter>(createAllParentToolFilter());
const previewCategoryId = ref<string | null>(CHART_CATEGORIES[0]?.id ?? null);
const detailCategoryId = ref<string | null>(null);
const isDetailOpen = ref(false);
const isPoolOpen = ref(false);
const isAccessSheetOpen = ref(false);
const currentPractice = ref<DailyPractice | null>(null);
const poaEntry = ref<POAEntry | null>(null);
const practiceLoadError = ref<string | null>(null);
const practiceBusy = ref(false);

const isSignedIn = computed(() => authStatus.value === 'signed-in' && Boolean(currentUser.value));
const isPracticeStarted = computed(() => currentPractice.value?.status === 'started');
const practiceControlsDisabled = computed(() => !isSignedIn.value || practiceBusy.value || isPracticeStarted.value);

const previewCategory = computed<ChartCategory | null>(() => {
  if (!previewCategoryId.value) return null;
  return CHART_CATEGORIES.find((category) => category.id === previewCategoryId.value) ?? null;
});

const canPickFromPreview = computed(() => !practiceControlsDisabled.value && Boolean(previewCategory.value));
const poolToolCount = computed(() =>
  selectedCategoryIds.value.reduce(
    (count, categoryId) => count + getFilteredTools(categoryId, selectedToolsByCategory.value).length,
    0,
  ),
);
const canDrawRandom = computed(() => !practiceControlsDisabled.value && poolToolCount.value > 0);
const canChooseDailyTool = computed(() => !practiceControlsDisabled.value);

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

function isCategorySelected(categoryId: string): boolean {
  return selectedCategoryIds.value.includes(categoryId);
}

function categoryPoolCount(category: ChartCategory): number {
  return getFilteredTools(category.id, selectedToolsByCategory.value).length;
}

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
    setPracticeError(error, 'Unable to load Today’s Practice.');
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

  isPoolOpen.value = true;
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

async function saveDailyAction(payload: POADraft): Promise<void> {
  const practice = currentPractice.value;
  if (!practice || practice.status !== 'started') return;

  await withPracticeOperation(async () => {
    poaEntry.value = await savePOA({
      dailyPracticeId: practice.id,
      mode: payload.mode,
      practiceNotes: payload.practiceNotes,
      observeMorning: payload.observeMorning,
      observeMidday: payload.observeMidday,
      observeEvening: payload.observeEvening,
      applyMorning: payload.applyMorning,
      applyMidday: payload.applyMidday,
      applyEvening: payload.applyEvening,
      journalText: payload.journalText,
    });

    currentPractice.value = (await getTodayPractice(practice.localDate)) ?? practice;
  });
}

function focusSelectedCategory(): void {
  if (currentPractice.value) {
    isPoolOpen.value = true;
    openCategoryDetail(currentPractice.value.selectedTool.categoryId);
  }
}

async function clearPreviewState(): Promise<void> {
  currentPractice.value = null;
  poaEntry.value = null;

  try {
    await clearTodayPracticePreview();
  } catch (error) {
    setPracticeError(error, 'Unable to clear the saved preview.');
  }
}

async function withPracticeOperation(operation: () => Promise<void>): Promise<void> {
  if (!isSignedIn.value) {
    practiceLoadError.value = 'Tester access is required to save today’s practice and POA.';
    return;
  }

  practiceBusy.value = true;
  practiceLoadError.value = null;
  try {
    await operation();
  } catch (error) {
    setPracticeError(error, 'Unable to save Today’s Practice.');
  } finally {
    practiceBusy.value = false;
  }
}

function setPracticeError(_error: unknown, fallback: string): void {
  // Keep primary Journal surfaces warm and non-technical. Detailed beta/security
  // configuration copy belongs in Settings → Beta data & security.
  practiceLoadError.value = fallback;
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
.lock-banner,
.error-banner {
  background: rgba(111, 135, 88, 0.18);
  border: 1px solid rgba(111, 135, 88, 0.45);
  border-radius: 16px;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  padding: 12px 14px;
}

.error-banner {
  background: rgba(184, 74, 72, 0.14);
  border-color: rgba(184, 74, 72, 0.45);
}

.access-gate h2 {
  margin-top: 6px;
}

.open-tester-access {
  margin-top: 12px;
  min-height: 44px;
}

.entry-panel {
  display: grid;
  gap: 12px;
}

.entry-panel h2 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 5.5vw, 1.7rem);
  font-weight: 600;
  line-height: 1.06;
  margin: 6px 0 0;
}

.route-grid {
  display: grid;
  gap: 10px;
}

.empty-state {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0;
  padding: 14px;
}

.pool-panel {
  display: grid;
  gap: 12px;
}

.pool-heading {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.pool-heading h2 {
  margin-top: 6px;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-row ion-button {
  min-height: 44px;
}

.empty-pool-note {
  background: rgba(184, 74, 72, 0.12);
  border: 1px solid rgba(184, 74, 72, 0.4);
  border-radius: 16px;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  padding: 12px;
}

.pool-list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pool-row {
  align-items: center;
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  display: flex;
  gap: 8px;
  padding: 4px 8px 4px 4px;
}

.pool-row.selected {
  border-color: var(--accent-primary);
}

.pool-toggle {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: var(--text-primary);
  display: grid;
  flex: 1 1 auto;
  gap: 2px 8px;
  grid-template-columns: auto 1fr;
  min-height: 44px;
  padding: 8px;
  text-align: left;
}

.pool-toggle:disabled,
.pool-details:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.family-dot {
  border-radius: 999px;
  display: inline-block;
  height: 10px;
  width: 10px;
}

.pool-name {
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.2;
}

.pool-meta {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  grid-column: 2;
}

.pool-details {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-primary);
  flex: 0 0 auto;
  font-size: 0.74rem;
  font-weight: 800;
  min-height: 40px;
  padding: 8px 12px;
}

.pool-footnote {
  font-size: 0.84rem;
}

.feedback-nudge {
  background: transparent;
  border: 1px dashed var(--border-subtle);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 700;
  min-height: 44px;
  padding: 12px;
  text-align: center;
  width: 100%;
}
</style>
