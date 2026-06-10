<template>
  <section class="circle-chart-shell" :class="{ locked: props.disabled }" aria-labelledby="circle-chart-title">
    <div class="section-kicker">Chart of Inspired Action</div>
    <div class="chart-heading-row">
      <div>
        <h2 id="circle-chart-title">Circle chart map</h2>
        <p>Tap chart areas to include them in today’s practice pool.</p>
      </div>
      <span class="selected-pill">{{ selectedCategoryIds.length }} selected</span>
    </div>

    <div class="chart-stage" role="group" aria-label="Selectable Chart of Inspired Action categories">
      <div class="chart-orbit outer" aria-hidden="true"></div>
      <div class="chart-orbit middle" aria-hidden="true"></div>
      <div class="chart-orbit inner" aria-hidden="true"></div>

      <button
        v-for="category in positionedCategories"
        :key="category.id"
        class="chart-node"
        :class="{ selected: isSelected(category.id) }"
        :style="nodeStyle(category)"
        type="button"
        :title="category.name"
        :aria-pressed="isSelected(category.id)"
        :aria-label="`${category.name}, ${getFamily(category.family).label}, ${category.toolCount} tools`"
        :disabled="props.disabled"
        @click="$emit('toggle-category', category.id)"
      >
        <span class="node-number">{{ category.indexLabel }}</span>
        <span class="node-family" :style="{ backgroundColor: getFamily(category.family).color }"></span>
      </button>

      <div class="chart-hub" aria-live="polite">
        <span class="hub-label">The Michael Chekhov Toolkit</span>
        <strong>{{ hubTitle }}</strong>
        <small>{{ hubSubtitle }}</small>
      </div>
    </div>

    <div class="category-directory" aria-label="Circle chart category directory">
      <button
        v-for="category in CHART_CATEGORIES"
        :key="`directory-${category.id}`"
        class="directory-row"
        :class="{ selected: isSelected(category.id) }"
        type="button"
        :aria-pressed="isSelected(category.id)"
        :disabled="props.disabled"
        @click="$emit('toggle-category', category.id)"
      >
        <span class="family-dot" :style="{ backgroundColor: getFamily(category.family).color }"></span>
        <span class="directory-name">{{ category.name }}</span>
        <span class="directory-meta">{{ getFamily(category.family).label }} · {{ category.toolCount }} tools</span>
      </button>
    </div>

    <div class="family-legend" aria-label="Chart families">
      <span v-for="family in CHART_FAMILIES" :key="family.id" class="family-chip">
        <span class="family-dot" :style="{ backgroundColor: family.color }"></span>
        {{ family.label }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CHART_CATEGORIES, CHART_FAMILIES, getCategory, getFamily, type ChartCategory } from '@/data/circleChartCatalog';

interface PositionedCategory extends ChartCategory {
  angle: number;
  indexLabel: string;
}

const props = withDefaults(
  defineProps<{
    selectedCategoryIds: string[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

defineEmits<{
  (event: 'toggle-category', categoryId: string): void;
}>();

const positionedCategories = computed<PositionedCategory[]>(() => {
  const total = CHART_CATEGORIES.length;

  return CHART_CATEGORIES.map((category, index) => ({
    ...category,
    angle: -90 + (index * 360) / total,
    indexLabel: String(index + 1).padStart(2, '0'),
  }));
});

const selectedCategories = computed(() =>
  props.selectedCategoryIds
    .map((categoryId) => getCategory(categoryId))
    .filter((category): category is ChartCategory => Boolean(category))
);

const hubTitle = computed(() => {
  if (selectedCategories.value.length === 0) return 'Choose chart areas';
  if (selectedCategories.value.length === 1) return selectedCategories.value[0].name;
  return `${selectedCategories.value.length} chart areas selected`;
});

const hubSubtitle = computed(() => {
  if (selectedCategories.value.length === 0) return 'Official taxonomy labels only';
  if (selectedCategories.value.length === 1) return getFamily(selectedCategories.value[0].family).label;
  return 'Ready for Pick My Own or Draw Random';
});

function isSelected(categoryId: string): boolean {
  return props.selectedCategoryIds.includes(categoryId);
}

function nodeStyle(category: PositionedCategory): Record<string, string> {
  const radians = (category.angle * Math.PI) / 180;
  const radius = 42;
  const x = 50 + Math.cos(radians) * radius;
  const y = 50 + Math.sin(radians) * radius;

  return {
    '--node-x': `${x}%`,
    '--node-y': `${y}%`,
    '--node-color': getFamily(category.family).color,
  };
}
</script>

<style scoped>
.circle-chart-shell {
  border: 1px solid rgba(99, 74, 50, 0.18);
  border-radius: 28px;
  background:
    radial-gradient(circle at 50% 8%, rgba(255, 247, 226, 0.95), rgba(255, 253, 247, 0.98) 42%, rgba(247, 237, 219, 0.92)),
    linear-gradient(135deg, rgba(146, 100, 45, 0.12), rgba(55, 43, 33, 0.04));
  box-shadow: 0 24px 70px rgba(64, 45, 28, 0.16);
  color: #38271a;
  padding: 18px;
}

.circle-chart-shell.locked {
  opacity: 0.82;
}

.circle-chart-shell.locked .chart-node,
.circle-chart-shell.locked .directory-row {
  cursor: not-allowed;
}

.section-kicker {
  color: #8a5c25;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.chart-heading-row {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.chart-heading-row h2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.45rem, 6vw, 2rem);
  line-height: 1.02;
  margin: 0;
}

.chart-heading-row p {
  color: rgba(56, 39, 26, 0.72);
  font-size: 0.94rem;
  line-height: 1.35;
  margin: 6px 0 0;
}

.selected-pill {
  background: rgba(56, 39, 26, 0.08);
  border: 1px solid rgba(56, 39, 26, 0.14);
  border-radius: 999px;
  color: #5e3b15;
  flex: 0 0 auto;
  font-size: 0.74rem;
  font-weight: 800;
  padding: 8px 10px;
}

.chart-stage {
  aspect-ratio: 1;
  margin: 18px auto 16px;
  max-width: 430px;
  min-height: 312px;
  position: relative;
  width: min(100%, 430px);
}

.chart-orbit,
.chart-hub,
.chart-node {
  position: absolute;
}

.chart-orbit {
  border: 1px solid rgba(98, 65, 32, 0.18);
  border-radius: 999px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.chart-orbit.outer {
  background: conic-gradient(
    from -90deg,
    rgba(139, 92, 246, 0.22) 0deg 72deg,
    rgba(217, 119, 6, 0.20) 72deg 168deg,
    rgba(15, 118, 110, 0.20) 168deg 240deg,
    rgba(37, 99, 235, 0.18) 240deg 312deg,
    rgba(190, 18, 60, 0.18) 312deg 360deg
  );
  height: 88%;
  width: 88%;
}

.chart-orbit.middle {
  background: rgba(255, 255, 255, 0.32);
  height: 62%;
  width: 62%;
}

.chart-orbit.inner {
  background: rgba(255, 252, 244, 0.75);
  height: 36%;
  width: 36%;
}

.chart-node {
  align-items: center;
  background: rgba(255, 253, 247, 0.96);
  border: 2px solid var(--node-color);
  border-radius: 999px;
  box-shadow: 0 10px 26px rgba(53, 35, 18, 0.18);
  color: #372416;
  display: inline-flex;
  height: clamp(42px, 11vw, 54px);
  justify-content: center;
  left: var(--node-x);
  min-width: clamp(42px, 11vw, 54px);
  padding: 0;
  top: var(--node-y);
  transform: translate(-50%, -50%);
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  z-index: 2;
}

.chart-node:focus-visible {
  outline: 3px solid rgba(36, 99, 235, 0.45);
  outline-offset: 4px;
}

.chart-node:hover,
.chart-node.selected {
  background: #fff7df;
  box-shadow: 0 14px 34px rgba(53, 35, 18, 0.24);
  transform: translate(-50%, -50%) scale(1.06);
}

.chart-node.selected {
  border-width: 3px;
}

.node-number {
  font-size: clamp(0.66rem, 2.7vw, 0.9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
}

.node-family {
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  bottom: -2px;
  height: 13px;
  position: absolute;
  right: -2px;
  width: 13px;
}

.chart-hub {
  align-items: center;
  background: rgba(255, 253, 247, 0.94);
  border: 1px solid rgba(75, 52, 29, 0.18);
  border-radius: 999px;
  box-shadow: inset 0 0 28px rgba(146, 100, 45, 0.12), 0 16px 38px rgba(50, 34, 18, 0.12);
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 38%;
  justify-content: center;
  left: 50%;
  padding: 18px;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 38%;
  z-index: 1;
}

.hub-label {
  color: rgba(55, 36, 22, 0.62);
  font-size: clamp(0.54rem, 2vw, 0.68rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.15;
  text-transform: uppercase;
}

.chart-hub strong {
  color: #342111;
  display: -webkit-box;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(0.86rem, 3.3vw, 1.08rem);
  line-height: 1.08;
  max-width: 15ch;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.chart-hub small {
  color: rgba(55, 36, 22, 0.68);
  font-size: clamp(0.6rem, 2.3vw, 0.72rem);
  font-weight: 700;
  line-height: 1.2;
}

.category-directory {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
  margin-top: 10px;
}

.directory-row {
  align-items: center;
  background: rgba(255, 253, 247, 0.76);
  border: 1px solid rgba(75, 52, 29, 0.14);
  border-radius: 16px;
  color: #38271a;
  display: grid;
  gap: 4px 8px;
  grid-template-columns: auto 1fr;
  padding: 10px 12px;
  text-align: left;
}

.directory-row.selected {
  background: #fff4d0;
  border-color: rgba(138, 92, 36, 0.48);
}

.directory-row:focus-visible {
  outline: 3px solid rgba(36, 99, 235, 0.42);
  outline-offset: 2px;
}

.family-dot {
  border-radius: 999px;
  display: inline-block;
  height: 10px;
  width: 10px;
}

.directory-name {
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.15;
}

.directory-meta {
  color: rgba(56, 39, 26, 0.64);
  font-size: 0.72rem;
  font-weight: 700;
  grid-column: 2;
}

.family-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.family-chip {
  align-items: center;
  background: rgba(255, 253, 247, 0.78);
  border: 1px solid rgba(75, 52, 29, 0.13);
  border-radius: 999px;
  color: rgba(56, 39, 26, 0.78);
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 800;
  gap: 6px;
  padding: 7px 9px;
}

@media (min-width: 760px) {
  .circle-chart-shell {
    padding: 24px;
  }

  .category-directory {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 370px) {
  .circle-chart-shell {
    padding: 14px;
  }

  .chart-stage {
    min-height: 286px;
  }

  .chart-hub {
    height: 42%;
    width: 42%;
  }
}
</style>
