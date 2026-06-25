<template>
  <ion-page>
    <ion-content class="chart-page">
      <main class="page-shell">
        <TopStatusBar />

        <CircleChart
          browse
          :show-directory="false"
          :selected-category-ids="selectedCategoryIds"
          :tool-filter="selectedParentToolsByCategory"
          :child-filter="selectedChildTools"
          @toggle-category="toggleCategory"
          @open-category="openCategoryDetail"
        />

        <section class="quick-draw-panel studio-panel" aria-labelledby="quick-draw-title">
          <ion-segment
            class="quick-draw-segment"
            :value="quickDrawView"
            aria-label="Quick Draw view"
            @ionChange="quickDrawView = ($event.detail.value as QuickDrawView) ?? 'draw'"
          >
            <ion-segment-button value="draw" data-testid="quick-draw-tab-draw">
              <ion-label>Draw</ion-label>
            </ion-segment-button>
            <ion-segment-button value="history" data-testid="quick-draw-tab-history">
              <ion-label>History</ion-label>
            </ion-segment-button>
          </ion-segment>

          <template v-if="quickDrawView === 'draw'">
          <div class="quick-draw-heading">
            <div>
              <p class="kicker">Quick Draw</p>
              <h2 id="quick-draw-title">Draw from the full chart</h2>
              <p class="quick-draw-count" aria-live="polite">
                {{ selectedCategoryIds.length }} chart area{{ selectedCategoryIds.length === 1 ? '' : 's' }} ·
                {{ drawablePoolCount }} drawable option{{ drawablePoolCount === 1 ? '' : 's' }}
              </p>
            </div>
            <ion-button
              data-testid="button-quick-draw"
              color="primary"
              :disabled="isDrawing || isDrawLocked"
              :aria-busy="isDrawing"
              @click="drawQuickTool"
            >
              {{ quickDrawButtonLabel }}
            </ion-button>
          </div>

          <label class="unveiling-control">
            <span>
              <strong>Veiling value</strong>
              <small>Optional 1-10 value included with the draw</small>
            </span>
            <ion-toggle
              :checked="includeUnveiling"
              aria-label="Include a veiling value with Quick Draw"
              @ionChange="includeUnveiling = $event.detail.checked"
            />
          </label>

          <p v-if="isDrawing" class="quick-draw-drawing paper-object" role="status" aria-live="assertive">
            <span class="drawing-dot" aria-hidden="true"></span>
            <span>Drawing…</span>
          </p>

          <article v-else-if="quickDrawResult" class="quick-result paper-object" aria-live="polite">
            <button
              class="quick-result-main"
              type="button"
              data-testid="quick-draw-result"
              :aria-label="`Open ${quickDrawResult.categoryName} detail for ${quickDrawResult.parentToolName}${quickDrawResult.childToolName ? `, ${quickDrawResult.childToolName}` : ''}`"
              @click="openQuickDrawDetail"
            >
              <span class="result-label-row">
                <span class="result-family" v-if="quickDrawFamilyLabel">{{ quickDrawFamilyLabel }}</span>
                <span>{{ quickDrawResult.categoryName }}</span>
                <span v-if="quickDrawResult.scaleValue">Tempo #{{ quickDrawResult.scaleValue }}</span>
                <span v-if="quickDrawResult.unveiledValue">Veiling {{ quickDrawResult.unveiledValue }}</span>
              </span>
              <strong>{{ resultTitle(quickDrawResult) }}</strong>
              <span v-if="!quickDrawResult.components?.length && quickDrawResult.childToolName" class="quick-child">{{ quickDrawResult.childToolName }}</span>
              <p v-if="quickDrawDescription" class="quick-result-desc" data-testid="quick-draw-description">
                {{ quickDrawDescription }}
              </p>
            </button>

            <!-- Movable Centers: each component slot is its own device-local lock
                 toggle. Locked slots are kept on the next "Draw another". -->
            <div
              v-if="quickDrawResult.components?.length"
              class="component-grid"
              role="group"
              aria-label="Movable Centers draw: lock a component to keep it on the next draw"
            >
              <button
                v-for="component in quickDrawResult.components"
                :key="component.label"
                type="button"
                class="component-chip"
                :class="{ locked: isComponentLocked(component.label) }"
                :aria-pressed="isComponentLocked(component.label)"
                :aria-label="`${isComponentLocked(component.label) ? 'Unlock' : 'Lock'} ${component.label}: ${component.value}`"
                :data-testid="`quick-draw-component-lock-${component.label.toLowerCase()}`"
                @click="toggleComponentLock(component.label)"
              >
                <small>{{ component.label }}</small>
                <b>{{ component.value }}</b>
                <ion-icon
                  class="chip-lock-icon"
                  aria-hidden="true"
                  :icon="isComponentLocked(component.label) ? lockClosedOutline : lockOpenOutline"
                />
              </button>
            </div>

            <div class="quick-result-actions">
              <button
                v-if="!quickDrawResult.components?.length"
                type="button"
                class="lock-toggle"
                :class="{ locked: singleLocked }"
                :aria-pressed="singleLocked"
                :aria-label="singleLocked ? 'Unlock this draw so Draw another rolls fresh' : 'Lock this draw so Draw another keeps it'"
                data-testid="quick-draw-lock"
                @click.stop="toggleSingleLock"
              >
                <ion-icon aria-hidden="true" :icon="singleLocked ? lockClosedOutline : lockOpenOutline" />
                <span>{{ singleLocked ? 'Locked' : 'Lock' }}</span>
              </button>
              <button type="button" @click.stop="beginQuickDrawPOA">Begin POA in Journal</button>
              <button type="button" @click.stop="dismissQuickDraw">Dismiss</button>
            </div>
          </article>

          <p v-else-if="quickDrawEmpty" class="quick-draw-empty" role="status">
            Nothing is available for Quick Draw. Select at least one chart area, parent tool, or example label.
          </p>

          <p v-else class="quick-draw-note">
            Draw from the chart without starting or saving today’s practice.
          </p>
          </template>

          <template v-else>
            <div class="quick-draw-heading">
              <div>
                <p class="kicker">Quick Draw history</p>
                <h2 id="quick-draw-title">Past chart draws</h2>
                <p class="quick-draw-count">
                  {{ quickDrawHistory.length }} draw{{ quickDrawHistory.length === 1 ? '' : 's' }} on this device
                </p>
              </div>
              <ion-button
                v-if="quickDrawHistory.length"
                size="small"
                fill="clear"
                color="medium"
                data-testid="quick-draw-history-clear"
                @click="clearQuickDrawHistory"
              >
                Clear
              </ion-button>
            </div>

            <p class="quick-draw-note">
              These chart draws are kept separate from your started practice and Journal history.
            </p>

            <ul v-if="quickDrawHistory.length" class="quick-draw-log" data-testid="quick-draw-history-list">
              <li v-for="entry in quickDrawHistory" :key="entry.id" class="quick-draw-log-row paper-object">
                <div class="log-main">
                  <span class="log-family" v-if="logFamilyLabel(entry)">{{ logFamilyLabel(entry) }}</span>
                  <strong class="log-headline">{{ logHeadline(entry) }}</strong>
                  <span v-if="logParent(entry)" class="log-parent">{{ logParent(entry) }}</span>
                  <span class="log-category">{{ entry.selectedTool.categoryName }}</span>
                </div>
                <time class="log-time" :datetime="entry.drawnAt">{{ formatDrawTime(entry.drawnAt) }}</time>
              </li>
            </ul>

            <p v-else class="quick-draw-note" data-testid="quick-draw-history-empty">
              No chart draws yet. Use the Draw tab to roll from the chart.
            </p>
          </template>
        </section>

        <button class="journal-cta paper-object" type="button" @click="router.push('/journal')">
          <span class="cta-copy">
            <span class="cta-kicker">Today’s Practice</span>
            <strong>{{ journalCtaLabel }}</strong>
          </span>
          <ion-icon aria-hidden="true" :icon="arrowForwardOutline" />
        </button>

        <section class="studio-panel directory-panel" aria-labelledby="chart-directory-title">
          <div class="directory-heading">
            <div>
              <p class="kicker">Chart areas</p>
              <h2 id="chart-directory-title">Categories at a glance</h2>
            </div>
            <span class="status-pill">
              {{ selectedCategoryIds.length }} / {{ CHART_CATEGORIES.length }} selected
            </span>
          </div>

          <div class="selector-actions" aria-label="Quick Draw pool controls">
            <ion-button
              data-testid="chart-select-all"
              size="small"
              fill="outline"
              color="medium"
              @click="selectAllChartPool"
            >
              Select all
            </ion-button>
            <ion-button
              data-testid="chart-deselect-all"
              size="small"
              fill="clear"
              color="medium"
              @click="deselectAllChartPool"
            >
              Deselect all
            </ion-button>
          </div>

          <ul class="category-cards">
            <li v-for="category in CHART_CATEGORIES" :key="category.id">
              <div class="category-card" :class="{ selected: isCategorySelected(category.id) }">
                <button
                  class="category-toggle"
                  type="button"
                  :data-testid="`category-toggle-${category.id}`"
                  :aria-pressed="isCategorySelected(category.id)"
                  :aria-label="`${category.name}: ${isCategorySelected(category.id) ? 'remove from' : 'add to'} Quick Draw pool`"
                  @click="toggleCategory(category.id)"
                >
                  <span class="family-dot" :style="{ backgroundColor: getFamily(category.family).color }"></span>
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-meta">
                    {{ getFamily(category.family).label }} · {{ categoryDrawableCount(category.id) }} of {{ category.toolCount }} drawable
                  </span>
                  <span class="selection-state">{{ isCategorySelected(category.id) ? 'Selected' : 'Excluded' }}</span>
                </button>
                <div class="category-actions">
                  <button
                    class="detail-link"
                    type="button"
                    aria-haspopup="dialog"
                    :aria-label="`Open ${category.name} details`"
                    @click="openCategoryDetail(category.id)"
                  >
                    Details
                  </button>
                  <button
                    class="library-link"
                    type="button"
                    :aria-label="`Open ${category.name} in Library`"
                    @click="openInLibrary(category.id)"
                  >
                    Library
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <CategoryDetailSheet
          :is-open="isDetailOpen"
          :category-id="detailCategoryId"
          :included="isDetailCategoryIncluded"
          :selected-tool-names="detailSelectedParentToolNames"
          :selected-children-by-tool="detailSelectedChildrenByTool"
          :highlighted-parent-tool-name="highlightedDetailSelection?.parentToolName ?? null"
          :highlighted-child-tool-name="highlightedDetailSelection?.childToolName ?? null"
          :locked="false"
          selection-context="chart"
          @dismiss="isDetailOpen = false"
          @set-included="setCategoryIncluded"
          @set-selected-tools="setSelectedParentTools"
          @set-selected-children="setSelectedChildren"
          @open-library="openInLibrary"
        />

        <footer class="chart-attribution">
          <p>{{ CHART_ATTRIBUTION }}</p>
        </footer>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonToggle } from '@ionic/vue';
import { arrowForwardOutline, lockClosedOutline, lockOpenOutline } from 'ionicons/icons';
import CategoryDetailSheet from '@/components/CategoryDetailSheet.vue';
import CircleChart from '@/components/CircleChart.vue';
import TopStatusBar from '@/components/TopStatusBar.vue';
import {
  clearQuickDrawHistory,
  loadQuickDrawHistory,
  logQuickDraw,
  quickDrawHistory,
  type QuickDrawHistoryEntry,
} from '@/stores/quickDrawHistoryStore';
import { CHART_ATTRIBUTION } from '@/constants/attribution';
import { CHART_CATEGORIES, getFamily } from '@/data/circleChartCatalog';
import {
  createAllChildToolFilter,
  createAllParentToolFilter,
  getDrawableSelectionCount,
  getToolCatalogCategory,
  type ChildToolFilter,
  type ParentToolFilter,
} from '@/data/toolCatalog';
import { drawNextQuickTool, isQuickDrawLocked } from '@/data/quickDrawLock';
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import { getTodayPractice } from '@/stores/dailyPracticeStore';
import type { PracticeToolSelection } from '@/types/practice';

const router = useRouter();

type QuickDrawView = 'draw' | 'history';
const quickDrawView = ref<QuickDrawView>('draw');

const detailCategoryId = ref<string | null>(null);
const isDetailOpen = ref(false);
const hasStartedPractice = ref(false);
const quickDrawResult = ref<PracticeToolSelection | null>(null);
const quickDrawEmpty = ref(false);
// Device-local Quick Draw lock (Chart tab only). Separate from the Journal
// daily-practice lock and from quick-draw history — see @/data/quickDrawLock.
const singleLocked = ref(false);
const lockedComponentLabels = ref<Set<string>>(new Set());
const isDrawing = ref(false);
const includeUnveiling = ref(false);
const highlightedDetailSelection = ref<PracticeToolSelection | null>(null);
const selectedCategoryIds = ref<string[]>(CHART_CATEGORIES.map((category) => category.id));
const selectedParentToolsByCategory = ref<ParentToolFilter>(createAllParentToolFilter());
const selectedChildTools = ref<ChildToolFilter>(createAllChildToolFilter());

const journalCtaLabel = computed(() =>
  hasStartedPractice.value ? 'Return to today’s practice' : 'Begin today’s practice in Journal',
);

// True when the current result is fully locked (single lock, or every Movable
// Centers component locked), so "Draw another" is a no-op and stays disabled.
const isDrawLocked = computed(() =>
  isQuickDrawLocked(quickDrawResult.value, {
    singleLocked: singleLocked.value,
    lockedComponentLabels: lockedComponentLabels.value,
  }),
);

const quickDrawButtonLabel = computed(() => {
  if (isDrawing.value) return 'Drawing…';
  if (isDrawLocked.value) return 'Locked';
  return quickDrawResult.value ? 'Draw another' : 'Quick Draw';
});

const quickDrawCategory = computed(() =>
  quickDrawResult.value
    ? CHART_CATEGORIES.find((category) => category.id === quickDrawResult.value?.categoryId) ?? null
    : null,
);

const quickDrawFamilyLabel = computed(() =>
  quickDrawCategory.value ? getFamily(quickDrawCategory.value.family).label : '',
);

// Sanctioned NMCA/source chart-area description (from circleChartCatalog); no AI-invented text.
const quickDrawDescription = computed(() => quickDrawCategory.value?.description ?? '');

const drawablePoolCount = computed(() =>
  selectedCategoryIds.value.reduce((count, categoryId) => count + categoryDrawableCount(categoryId), 0),
);

const isDetailCategoryIncluded = computed(() =>
  Boolean(detailCategoryId.value && selectedCategoryIds.value.includes(detailCategoryId.value)),
);

const detailSelectedParentToolNames = computed(() =>
  detailCategoryId.value ? selectedParentToolsByCategory.value[detailCategoryId.value] ?? [] : [],
);

const detailSelectedChildrenByTool = computed(() =>
  detailCategoryId.value ? selectedChildTools.value[detailCategoryId.value] ?? {} : {},
);

onMounted(async () => {
  loadQuickDrawHistory();

  await loadSession();

  if (authStatus.value !== 'signed-in' || !currentUser.value) return;

  try {
    const practice = await getTodayPractice();
    hasStartedPractice.value = practice?.status === 'started';
  } catch {
    // Quiet on Chart: practice state detail belongs to Journal.
  }
});

function isCategorySelected(categoryId: string): boolean {
  return selectedCategoryIds.value.includes(categoryId);
}

function categoryDrawableCount(categoryId: string): number {
  return getDrawableSelectionCount(categoryId, selectedParentToolsByCategory.value, selectedChildTools.value);
}

function openCategoryDetail(categoryId: string): void {
  highlightedDetailSelection.value = null;
  detailCategoryId.value = categoryId;
  isDetailOpen.value = true;
}

function openInLibrary(categoryId: string): void {
  isDetailOpen.value = false;
  router.push({ path: '/library', query: { category: categoryId } });
}

function toggleCategory(categoryId: string): void {
  quickDrawEmpty.value = false;
  selectedCategoryIds.value = selectedCategoryIds.value.includes(categoryId)
    ? selectedCategoryIds.value.filter((id) => id !== categoryId)
    : [...new Set([...selectedCategoryIds.value, categoryId])];
}

function setCategoryIncluded(categoryId: string, included: boolean): void {
  quickDrawEmpty.value = false;
  selectedCategoryIds.value = included
    ? [...new Set([...selectedCategoryIds.value, categoryId])]
    : selectedCategoryIds.value.filter((id) => id !== categoryId);
}

function setSelectedParentTools(categoryId: string, toolNames: string[]): void {
  quickDrawEmpty.value = false;
  selectedParentToolsByCategory.value = {
    ...selectedParentToolsByCategory.value,
    [categoryId]: toolNames,
  };

  if (toolNames.length > 0) {
    setCategoryIncluded(categoryId, true);
  }
}

function setSelectedChildren(categoryId: string, parentToolName: string, childNames: string[]): void {
  quickDrawEmpty.value = false;
  selectedChildTools.value = {
    ...selectedChildTools.value,
    [categoryId]: {
      ...(selectedChildTools.value[categoryId] ?? {}),
      [parentToolName]: childNames,
    },
  };

  if (childNames.length > 0) {
    setCategoryIncluded(categoryId, true);
    const currentParents = selectedParentToolsByCategory.value[categoryId] ?? [];
    if (!currentParents.includes(parentToolName)) {
      selectedParentToolsByCategory.value = {
        ...selectedParentToolsByCategory.value,
        [categoryId]: [...currentParents, parentToolName],
      };
    }
  }
}

function selectAllChartPool(): void {
  quickDrawResult.value = null;
  quickDrawEmpty.value = false;
  highlightedDetailSelection.value = null;
  resetQuickDrawLocks();
  selectedCategoryIds.value = CHART_CATEGORIES.map((category) => category.id);
  selectedParentToolsByCategory.value = createAllParentToolFilter();
  selectedChildTools.value = createAllChildToolFilter();
}

function deselectAllChartPool(): void {
  quickDrawResult.value = null;
  quickDrawEmpty.value = false;
  highlightedDetailSelection.value = null;
  resetQuickDrawLocks();
  selectedCategoryIds.value = [];
  selectedParentToolsByCategory.value = createEmptyParentToolFilter();
  selectedChildTools.value = createEmptyChildToolFilter();
}

// Brief LOCAL suspense so the draw reads as a deliberate reveal, not an instant flip.
// 100% page-local — no store, mirroring the spirit of the Journal busy flag.
const DRAW_SUSPENSE_MS = 280;
let drawTimer: ReturnType<typeof setTimeout> | null = null;

function drawQuickTool(): void {
  // Fully locked result (single lock, or all Movable Centers components locked):
  // "Draw another" keeps the current result unchanged.
  if (isDrawing.value || isDrawLocked.value) return;

  isDrawing.value = true;
  quickDrawEmpty.value = false;
  highlightedDetailSelection.value = null;
  const previous = quickDrawResult.value;
  quickDrawResult.value = null;

  if (drawTimer) clearTimeout(drawTimer);
  drawTimer = setTimeout(() => {
    // Re-roll honors device-local locks: locked single result is preserved, and
    // locked Movable Centers component slots are kept while the rest re-roll.
    const result = drawNextQuickTool(
      previous,
      { singleLocked: singleLocked.value, lockedComponentLabels: lockedComponentLabels.value },
      {
        categoryIds: selectedCategoryIds.value,
        parentFilter: selectedParentToolsByCategory.value,
        childFilter: selectedChildTools.value,
        includeUnveiling: includeUnveiling.value,
      },
    );
    quickDrawResult.value = result;
    quickDrawEmpty.value = !result;
    highlightedDetailSelection.value = result;
    isDrawing.value = false;
    drawTimer = null;

    syncLocksToResult(result);

    // Wave 1: chart Quick Draws are now logged, kept SEPARATE from Journal /
    // committed-practice history (device-local; no day is started or saved).
    if (result) {
      logQuickDraw(result);
    }
  }, DRAW_SUSPENSE_MS);
}

// Keep the device-local lock state consistent with the freshly drawn result.
// A new single result always starts unlocked; Movable Centers component locks are
// pruned to the labels that still exist in the new draw.
function syncLocksToResult(result: PracticeToolSelection | null): void {
  singleLocked.value = false;

  if (result?.components?.length) {
    const labels = new Set(result.components.map((component) => component.label));
    lockedComponentLabels.value = new Set(
      [...lockedComponentLabels.value].filter((label) => labels.has(label)),
    );
  } else {
    lockedComponentLabels.value = new Set();
  }
}

function toggleSingleLock(): void {
  singleLocked.value = !singleLocked.value;
}

function isComponentLocked(label: string): boolean {
  return lockedComponentLabels.value.has(label);
}

function toggleComponentLock(label: string): void {
  const next = new Set(lockedComponentLabels.value);
  if (next.has(label)) {
    next.delete(label);
  } else {
    next.add(label);
  }
  lockedComponentLabels.value = next;
}

function resetQuickDrawLocks(): void {
  singleLocked.value = false;
  lockedComponentLabels.value = new Set();
}

onBeforeUnmount(() => {
  if (drawTimer) clearTimeout(drawTimer);
});

function beginQuickDrawPOA(): void {
  if (!quickDrawResult.value) return;

  window.sessionStorage.setItem('chekhov:quick-draw-preview', JSON.stringify(quickDrawResult.value));
  router.push({ path: '/journal', query: { preview: 'quick-draw' } });
}

function openQuickDrawDetail(): void {
  if (!quickDrawResult.value) return;

  highlightedDetailSelection.value = quickDrawResult.value;
  detailCategoryId.value = quickDrawResult.value.categoryId;
  isDetailOpen.value = true;
}

function dismissQuickDraw(): void {
  quickDrawResult.value = null;
  quickDrawEmpty.value = false;
  highlightedDetailSelection.value = null;
  resetQuickDrawLocks();
}

function resultTitle(selection: PracticeToolSelection): string {
  return selection.components?.length ? selection.categoryName : selection.parentToolName;
}

// History headline = the most specific tool drawn. The child/example tool is the
// prominent top line; the parent tool drops to a secondary line beneath it. When
// no child was drawn, the parent (or a Movable Centers composite) headlines and
// the secondary line is omitted to avoid repeating the same label.
function logHeadline(entry: QuickDrawHistoryEntry): string {
  return entry.selectedTool.childToolName || resultTitle(entry.selectedTool);
}

function logParent(entry: QuickDrawHistoryEntry): string {
  return entry.selectedTool.childToolName ? entry.selectedTool.parentToolName : '';
}

function logFamilyLabel(entry: QuickDrawHistoryEntry): string {
  const category = CHART_CATEGORIES.find((item) => item.id === entry.selectedTool.categoryId);
  return category ? getFamily(category.family).label : '';
}

function formatDrawTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

function createEmptyParentToolFilter(): ParentToolFilter {
  const filter: ParentToolFilter = {};
  for (const category of CHART_CATEGORIES) {
    filter[category.id] = [];
  }
  return filter;
}

function createEmptyChildToolFilter(): ChildToolFilter {
  const filter: ChildToolFilter = {};
  for (const category of CHART_CATEGORIES) {
    const catalogCategory = getToolCatalogCategory(category.id);
    filter[category.id] = {};
    for (const tool of catalogCategory?.tools ?? []) {
      filter[category.id][tool.name] = [];
    }
  }
  return filter;
}
</script>

<style scoped>
.quick-draw-panel {
  display: grid;
  gap: 12px;
}

.quick-draw-segment {
  margin-bottom: 2px;
}

.quick-draw-log {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.quick-draw-log-row {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 14px;
}

.quick-draw-log-row .log-main {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.log-family {
  color: var(--accent-primary);
  font-size: 0.64rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quick-draw-log-row strong {
  color: var(--text-on-paper);
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 600;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.log-parent {
  color: var(--text-on-paper-soft);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.log-category {
  color: var(--text-on-paper-soft);
  font-size: 0.74rem;
  font-weight: 700;
}

.log-time {
  color: var(--text-on-paper-soft);
  flex: 0 0 auto;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: right;
}

.quick-draw-heading {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.quick-draw-heading h2 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 5.5vw, 1.65rem);
  font-weight: 600;
  line-height: 1.06;
  margin: 6px 0 0;
}

.quick-draw-heading ion-button {
  flex: 0 0 auto;
  min-height: 44px;
}

.unveiling-control {
  align-items: center;
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 11px 12px;
}

.unveiling-control span {
  display: grid;
  gap: 2px;
}

.unveiling-control strong {
  color: var(--text-primary);
  font-size: 0.92rem;
}

.unveiling-control small {
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.3;
}

.unveiling-control ion-toggle {
  flex: 0 0 auto;
}

.quick-draw-count,
.quick-draw-note {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.45;
  margin: 0;
}

.quick-draw-count {
  font-size: 0.78rem;
  font-weight: 800;
  margin-top: 6px;
}

.quick-draw-empty {
  background: rgba(184, 74, 72, 0.12);
  border: 1px solid rgba(184, 74, 72, 0.4);
  border-radius: 16px;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 750;
  line-height: 1.4;
  margin: 0;
  padding: 12px;
}

.quick-draw-drawing {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 0;
  min-height: 64px;
  padding: 18px 16px;
}

.quick-draw-drawing span:not(.drawing-dot) {
  color: var(--text-on-paper);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.drawing-dot {
  animation: drawing-pulse 900ms ease-in-out infinite;
  background: var(--accent-primary);
  border-radius: 999px;
  flex: 0 0 auto;
  height: 12px;
  width: 12px;
}

@keyframes drawing-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawing-dot {
    animation: none;
    opacity: 0.85;
  }
}

.quick-result {
  display: grid;
  gap: 10px;
  text-align: center;
}

.result-family {
  background: var(--accent-soft) !important;
  border-color: rgba(138, 92, 36, 0.32) !important;
  color: var(--accent-primary) !important;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.quick-result-desc {
  color: var(--text-on-paper-soft);
  font-size: 0.86rem;
  line-height: 1.5;
  margin: 2px 0 0;
  max-width: 34ch;
  overflow-wrap: anywhere;
  text-wrap: pretty;
}

.quick-result-main {
  align-items: center;
  background: transparent;
  border: none;
  color: inherit;
  display: grid;
  gap: 10px;
  justify-items: center;
  padding: 0;
  text-align: center;
  width: 100%;
}

.quick-result-main:focus-visible {
  border-radius: 14px;
  outline: 3px solid var(--focus-ring);
  outline-offset: 4px;
}

.result-label-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.result-label-row span {
  background: rgba(55, 36, 22, 0.08);
  border: 1px solid var(--border-on-paper);
  border-radius: 999px;
  color: var(--text-on-paper-soft);
  font-size: 0.72rem;
  font-weight: 900;
  padding: 6px 9px;
}

.quick-result strong {
  color: var(--text-on-paper);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 6vw, 2rem);
  font-weight: 600;
  line-height: 1.05;
}

.quick-child {
  color: var(--text-on-paper-soft);
  display: block;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
  margin: 0;
}

.component-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: 100%;
}

.component-chip {
  background: rgba(55, 36, 22, 0.06);
  border: 1px solid var(--border-on-paper);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  font: inherit;
  gap: 3px;
  min-height: 44px;
  min-width: 0;
  padding: 9px 26px 9px 8px;
  position: relative;
  text-align: left;
  width: 100%;
}

.component-chip:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.component-chip.locked {
  background: var(--accent-soft);
  border-color: var(--accent-primary);
}

.chip-lock-icon {
  color: var(--text-on-paper-soft);
  font-size: 0.92rem;
  position: absolute;
  right: 7px;
  top: 7px;
}

.component-chip.locked .chip-lock-icon {
  color: var(--accent-primary);
}

.component-chip small {
  color: var(--text-on-paper-soft);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.component-chip b {
  color: var(--text-on-paper);
  font-size: 0.82rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.quick-result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 2px;
}

.quick-result-actions button {
  background: rgba(255, 253, 247, 0.8);
  border: 1px solid var(--border-on-paper);
  border-radius: 999px;
  color: var(--text-on-paper);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 900;
  min-height: 40px;
  padding: 8px 12px;
}

.quick-result-actions .lock-toggle {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.quick-result-actions .lock-toggle ion-icon {
  font-size: 1rem;
}

.quick-result-actions .lock-toggle.locked {
  background: var(--accent-soft);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.journal-cta {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  min-height: 64px;
  text-align: left;
  transition: transform 160ms ease;
  width: 100%;
}

.journal-cta:active {
  transform: scale(0.99);
}

.cta-copy {
  display: grid;
  gap: 2px;
}

.cta-kicker {
  color: var(--text-on-paper-soft);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.journal-cta strong {
  color: var(--text-on-paper);
  font-family: var(--font-display);
  font-size: 1.05rem;
  line-height: 1.2;
}

.journal-cta ion-icon {
  color: var(--text-on-paper);
  flex: 0 0 auto;
  font-size: 1.3rem;
}

.directory-panel {
  display: grid;
  gap: 12px;
}

.directory-heading {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.directory-panel h2 {
  margin-top: 6px;
}

.selector-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selector-actions ion-button {
  min-height: 44px;
}

.category-cards {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-card {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 6px;
}

.category-card.selected {
  background: var(--surface);
  border-color: var(--accent-primary);
}

.category-toggle {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: var(--text-primary);
  display: grid;
  flex: 1 1 auto;
  gap: 2px 8px;
  grid-template-columns: auto minmax(0, 1fr);
  min-height: 44px;
  min-width: 0;
  padding: 8px;
  text-align: left;
}

.category-toggle:focus-visible,
.detail-link:focus-visible,
.library-link:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.family-dot {
  border-radius: 999px;
  display: inline-block;
  height: 10px;
  width: 10px;
}

.category-name {
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.2;
  min-width: 0;
  overflow-wrap: anywhere;
}

.category-meta {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  grid-column: 2;
  min-width: 0;
  overflow-wrap: anywhere;
}

.selection-state {
  align-self: center;
  background: rgba(55, 36, 22, 0.07);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.66rem;
  font-weight: 900;
  grid-column: 2;
  grid-row: 3;
  justify-self: start;
  padding: 5px 8px;
  text-transform: uppercase;
}

.category-card.selected .selection-state {
  background: var(--accent-soft);
  border-color: rgba(138, 92, 36, 0.3);
  color: var(--accent-primary);
}

/* Two equal-width action buttons in a single tidy row: consistent width and
   spacing, no flex-wrap offset. Restores the clean pill treatment from the
   pre-refactor single-pill card (84fb147), extended to hold both actions. */
.category-actions {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
}

.detail-link,
.library-link {
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-primary);
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 800;
  justify-content: center;
  min-height: 40px;
  padding: 8px 12px;
  text-align: center;
  width: 100%;
}

.library-link {
  color: var(--accent-primary);
}

.chart-attribution p {
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.45;
  margin: 0;
  text-align: center;
}

@media (min-width: 760px) {
  .category-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
