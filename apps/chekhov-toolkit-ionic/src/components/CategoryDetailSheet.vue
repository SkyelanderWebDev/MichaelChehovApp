<template>
  <ion-modal
    class="category-detail-modal"
    :is-open="isOpen"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    @didDismiss="$emit('dismiss')"
  >
    <ion-content v-if="category" class="detail-content">
      <div class="detail-shell">
        <header class="detail-header">
          <p class="detail-kicker">Chart of Inspired Action · Category detail</p>
          <h2 class="detail-title">{{ category.name }}</h2>
          <p class="detail-family">
            <span class="family-dot" :style="{ backgroundColor: family.color }"></span>
            {{ family.label }} family · {{ tools.length }} parent tool{{ tools.length === 1 ? '' : 's' }}
          </p>
          <p v-if="category.description" class="detail-description">{{ category.description }}</p>
        </header>

        <label v-if="!browse" class="include-row">
          <span class="include-copy">
            <strong>Include in {{ poolLabel }}</strong>
            <small>{{ poolDescription }}</small>
          </span>
          <ion-toggle
            class="include-toggle"
            :checked="included"
            :disabled="locked"
            :aria-label="`Include this chart area in the ${poolLabel}`"
            @ionChange="$emit('set-included', category.id, $event.detail.checked)"
          />
        </label>

        <div v-if="!browse" class="filter-controls">
          <ion-button
            class="select-all-tools"
            size="small"
            fill="outline"
            color="medium"
            :disabled="locked || allToolsSelected"
            @click="$emit('set-selected-tools', category.id, tools.map((tool) => tool.name))"
          >
            Select all parent tools
          </ion-button>
          <ion-button
            class="deselect-all-tools"
            size="small"
            fill="clear"
            color="medium"
            :disabled="locked || selectedToolNames.length === 0"
            @click="$emit('set-selected-tools', category.id, [])"
          >
            Deselect all
          </ion-button>
          <span class="tool-count-pill" aria-live="polite">
            {{ selectedToolNames.length }} of {{ tools.length }} selected
          </span>
        </div>

        <p v-if="browse" class="detail-note browse-note">
          Source-backed taxonomy labels only. Choose and start tools from the Journal tab.
        </p>
        <p v-else-if="locked" class="detail-note locked-note">
          Today’s practice is started, so this detail view is read-only until tomorrow.
        </p>
        <p v-else-if="selectedToolNames.length === 0" class="detail-note excluded-note">
          No parent tools selected — this chart area is excluded from Draw Random until you select at least one.
        </p>

        <ul class="parent-tool-list">
          <li
            v-for="tool in tools"
            :key="tool.name"
            class="parent-tool-row"
            :class="{ highlighted: isHighlightedParent(tool.name) }"
          >
            <div class="tool-row-head">
              <span v-if="browse" class="tool-name">{{ tool.name }}</span>
              <ion-checkbox
                v-else
                class="tool-checkbox"
                label-placement="end"
                :checked="selectedToolNames.includes(tool.name)"
                :disabled="locked"
                :aria-label="`Include ${tool.name} in the ${poolLabel}`"
                @ionChange="toggleTool(tool.name, $event.detail.checked)"
              >
                {{ tool.name }}
              </ion-checkbox>
              <span v-if="tool.scope" class="scope-pill">{{ formatScope(tool.scope) }}</span>
              <ion-button
                v-if="!browse && selectionContext === 'practice'"
                class="preview-tool-button"
                size="small"
                fill="outline"
                color="dark"
                :disabled="locked"
                @click="$emit('preview-tool', category.id, tool.name)"
              >
                Preview
              </ion-button>
            </div>
            <div v-if="childSelectionEnabled && tool.children.length > 0" class="child-filter-block">
              <div class="child-filter-actions">
                <span>{{ selectedChildCount(tool.name) }} of {{ tool.children.length }} child labels selected</span>
                <button
                  type="button"
                  :disabled="locked || !selectedToolNames.includes(tool.name) || selectedChildCount(tool.name) === tool.children.length"
                  @click="setSelectedChildren(tool.name, [...tool.children])"
                >
                  Select all children
                </button>
                <button
                  type="button"
                  :disabled="locked || !selectedToolNames.includes(tool.name) || selectedChildCount(tool.name) === 0"
                  @click="setSelectedChildren(tool.name, [])"
                >
                  Deselect children
                </button>
              </div>
              <div class="child-selectors" aria-label="Child and example label selectors">
                <ion-checkbox
                  v-for="child in tool.children"
                  :key="child"
                  class="child-selector"
                  data-testid="child-selector"
                  :data-child-name="child"
                  label-placement="end"
                  :checked="selectedChildrenForTool(tool.name).includes(child)"
                  :disabled="locked || !selectedToolNames.includes(tool.name)"
                  :class="{ highlighted: isHighlightedChild(tool.name, child) }"
                  :aria-label="`Include ${child} under ${tool.name} in the ${poolLabel}`"
                  @ionChange="toggleChild(tool.name, child, $event.detail.checked)"
                >
                  {{ child }}
                </ion-checkbox>
              </div>
            </div>
            <div v-else-if="tool.children.length > 0" class="child-chips" aria-label="Child and example labels">
              <span v-for="child in tool.children" :key="child" class="child-chip">{{ child }}</span>
            </div>
          </li>
        </ul>
      </div>
    </ion-content>

    <ion-footer v-if="category" class="detail-footer-bar">
      <div class="detail-footer-inner">
        <ion-button
          v-if="browse"
          class="open-in-library"
          expand="block"
          fill="outline"
          color="primary"
          @click="$emit('open-library', category.id)"
        >
          Open in Library
        </ion-button>
        <ion-button class="close-detail" expand="block" color="primary" @click="$emit('dismiss')">
          Done
        </ion-button>
      </div>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonButton, IonCheckbox, IonContent, IonFooter, IonModal, IonToggle } from '@ionic/vue';
import { getCategory, getFamily, CHART_FAMILIES, type ChartCategory, type ChartFamily } from '@/data/circleChartCatalog';
import { getToolCatalogCategory, type WeekendTool } from '@/data/toolCatalog';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    categoryId: string | null;
    included: boolean;
    selectedToolNames: string[];
    locked: boolean;
    /** Read-only quick-access mode for the Chart tab: no pool editing controls. */
    browse?: boolean;
    selectionContext?: 'practice' | 'chart';
    selectedChildrenByTool?: Record<string, string[]>;
    highlightedParentToolName?: string | null;
    highlightedChildToolName?: string | null;
  }>(),
  {
    browse: false,
    selectionContext: 'practice',
    selectedChildrenByTool: undefined,
    highlightedParentToolName: null,
    highlightedChildToolName: null,
  },
);

const emit = defineEmits<{
  (event: 'dismiss'): void;
  (event: 'set-included', categoryId: string, included: boolean): void;
  (event: 'set-selected-tools', categoryId: string, toolNames: string[]): void;
  (event: 'set-selected-children', categoryId: string, parentToolName: string, childNames: string[]): void;
  (event: 'preview-tool', categoryId: string, parentToolName: string): void;
  (event: 'open-library', categoryId: string): void;
}>();

const category = computed<ChartCategory | null>(() =>
  props.categoryId ? getCategory(props.categoryId) ?? null : null,
);

const family = computed<ChartFamily>(() =>
  category.value ? getFamily(category.value.family) : CHART_FAMILIES[0],
);

const tools = computed<readonly WeekendTool[]>(() =>
  category.value ? getToolCatalogCategory(category.value.id)?.tools ?? [] : [],
);

const allToolsSelected = computed(
  () => tools.value.length > 0 && props.selectedToolNames.length === tools.value.length,
);

const childSelectionEnabled = computed(() => Boolean(props.selectedChildrenByTool));

const poolLabel = computed(() => (props.selectionContext === 'chart' ? 'Quick Draw pool' : 'practice pool'));

const poolDescription = computed(() =>
  props.selectionContext === 'chart'
    ? 'Chart Quick Draw only uses included chart areas.'
    : 'Draw Random only uses included chart areas.',
);

function toggleTool(toolName: string, checked: boolean): void {
  if (!category.value) return;

  const next = checked
    ? [...new Set([...props.selectedToolNames, toolName])]
    : props.selectedToolNames.filter((name) => name !== toolName);

  emit('set-selected-tools', category.value.id, next);
}

function selectedChildrenForTool(toolName: string): string[] {
  if (!props.selectedChildrenByTool || !(toolName in props.selectedChildrenByTool)) {
    return [...(tools.value.find((tool) => tool.name === toolName)?.children ?? [])];
  }

  return props.selectedChildrenByTool[toolName];
}

function selectedChildCount(toolName: string): number {
  return selectedChildrenForTool(toolName).length;
}

function setSelectedChildren(toolName: string, childNames: string[]): void {
  if (!category.value) return;

  emit('set-selected-children', category.value.id, toolName, childNames);
}

function toggleChild(toolName: string, childName: string, checked: boolean): void {
  const current = selectedChildrenForTool(toolName);
  const next = checked
    ? [...new Set([...current, childName])]
    : current.filter((name) => name !== childName);

  setSelectedChildren(toolName, next);
}

function isHighlightedParent(toolName: string): boolean {
  return props.highlightedParentToolName === toolName;
}

function isHighlightedChild(toolName: string, childName: string): boolean {
  return props.highlightedParentToolName === toolName && props.highlightedChildToolName === childName;
}

function formatScope(scope: WeekendTool['scope']): string {
  if (scope === 'full-body') return 'full body';
  if (scope === 'parts') return 'parts';
  return 'full body + parts';
}
</script>

<style scoped>
.detail-content {
  --background: #f9f2e4;
}

.detail-shell {
  color: #372416;
  display: grid;
  gap: 14px;
  margin: 0 auto;
  max-width: 640px;
  padding: 18px 16px 28px;
}

.detail-kicker {
  color: #8a5c25;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.detail-title {
  color: #2e1c0f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.5rem, 6.4vw, 2.1rem);
  line-height: 1.04;
  margin: 0;
}

.detail-family {
  align-items: center;
  color: rgba(55, 36, 22, 0.74);
  display: flex;
  font-size: 0.9rem;
  font-weight: 700;
  gap: 7px;
  margin: 8px 0 0;
}

.detail-description {
  color: rgba(55, 36, 22, 0.78);
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.42;
  margin: 10px 0 0;
}

.family-dot {
  border-radius: 999px;
  display: inline-block;
  flex: 0 0 auto;
  height: 11px;
  width: 11px;
}

.include-row {
  align-items: center;
  background: rgba(255, 253, 247, 0.92);
  border: 1px solid rgba(75, 52, 29, 0.16);
  border-radius: 18px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 14px;
}

.include-copy {
  display: grid;
  gap: 2px;
}

.include-copy strong {
  color: #2e1c0f;
  font-size: 0.95rem;
}

.include-copy small {
  color: rgba(55, 36, 22, 0.66);
  font-size: 0.78rem;
  font-weight: 700;
}

.filter-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tool-count-pill {
  background: rgba(55, 36, 22, 0.08);
  border-radius: 999px;
  color: #5b3a17;
  font-size: 0.76rem;
  font-weight: 900;
  margin-left: auto;
  padding: 7px 10px;
}

.detail-note {
  border-radius: 14px;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  padding: 11px 12px;
}

.excluded-note {
  background: rgba(190, 18, 60, 0.08);
  border: 1px solid rgba(190, 18, 60, 0.2);
  color: #8c1f3e;
}

.locked-note {
  background: rgba(55, 120, 72, 0.1);
  border: 1px solid rgba(55, 120, 72, 0.22);
  color: #244a2e;
}

.browse-note {
  background: rgba(46, 33, 23, 0.05);
  border: 1px solid var(--border-on-paper);
  color: var(--text-on-paper-soft);
}

.tool-name {
  color: #2e1c0f;
  font-size: 0.98rem;
  font-weight: 800;
}

.scope-pill {
  background: rgba(55, 120, 72, 0.1);
  border: 1px solid rgba(55, 120, 72, 0.22);
  border-radius: 999px;
  color: #244a2e;
  flex: 0 0 auto;
  font-size: 0.68rem;
  font-weight: 900;
  padding: 5px 8px;
  text-transform: uppercase;
}

.detail-footer-inner {
  display: grid;
  gap: 8px;
}

.parent-tool-list {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.parent-tool-row {
  background: rgba(255, 253, 247, 0.92);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 18px;
  display: grid;
  gap: 8px;
  padding: 12px 14px;
}

.parent-tool-row.highlighted {
  background: #fff4d0;
  border-color: rgba(138, 92, 36, 0.5);
  box-shadow: inset 0 0 0 1px rgba(138, 92, 36, 0.15);
}

.tool-row-head {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.tool-checkbox {
  --checkbox-background-checked: #8a5c25;
  --border-color-checked: #8a5c25;
  color: #2e1c0f;
  font-size: 0.98rem;
  font-weight: 800;
  min-height: 28px;
}

.preview-tool-button {
  flex: 0 0 auto;
  min-height: 36px;
}

.child-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.child-filter-block {
  display: grid;
  gap: 8px;
}

.child-filter-actions {
  align-items: center;
  color: rgba(55, 36, 22, 0.68);
  display: flex;
  flex-wrap: wrap;
  font-size: 0.72rem;
  font-weight: 800;
  gap: 6px;
}

.child-filter-actions span {
  margin-right: auto;
}

.child-filter-actions button {
  background: rgba(255, 253, 247, 0.78);
  border: 1px solid rgba(75, 52, 29, 0.16);
  border-radius: 999px;
  color: #5b3a17;
  font: inherit;
  font-size: 0.7rem;
  min-height: 32px;
  padding: 5px 9px;
}

.child-filter-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.child-selectors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.child-chip {
  background: rgba(55, 36, 22, 0.06);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 999px;
  color: rgba(55, 36, 22, 0.78);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 5px 9px;
}

.child-selector {
  --checkbox-background-checked: #8a5c25;
  --border-color-checked: #8a5c25;
  background: rgba(55, 36, 22, 0.06);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 999px;
  color: rgba(55, 36, 22, 0.82);
  font-size: 0.74rem;
  font-weight: 750;
  min-height: 34px;
  padding: 4px 9px 4px 7px;
}

.child-selector.highlighted {
  background: rgba(138, 92, 36, 0.17);
  border-color: rgba(138, 92, 36, 0.48);
  color: #372416;
}

.detail-footer-bar {
  background: #f9f2e4;
  box-shadow: 0 -8px 22px rgba(65, 43, 22, 0.08);
}

.detail-footer-inner {
  margin: 0 auto;
  max-width: 640px;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
}
</style>
