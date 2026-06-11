<template>
  <ion-page>
    <ion-content class="library-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Source-grounded reference</p>
          <h1>Library</h1>
          <p class="page-subtitle">
            Browse the Chart of Inspired Action taxonomy: families, chart areas, parent tools, and label seeds.
          </p>
        </header>

        <p class="library-note">
          Source cards and approved excerpts arrive as beta material is approved. Labels below are
          source-backed taxonomy only — no generated practice prompts.
        </p>

        <section
          v-for="familyGroup in familyGroups"
          :key="familyGroup.family.id"
          class="studio-panel family-shelf"
          :aria-label="`${familyGroup.family.label} family`"
        >
          <p class="kicker family-kicker">
            <span class="family-dot" :style="{ backgroundColor: familyGroup.family.color }"></span>
            {{ familyGroup.family.label }}
          </p>

          <details
            v-for="entry in familyGroup.categories"
            :key="entry.category.id"
            :ref="(el) => registerCategoryRef(entry.category.id, el)"
            class="category-entry"
            :open="entry.category.id === focusedCategoryId"
          >
            <summary>
              <span class="entry-name">{{ entry.category.name }}</span>
              <span class="entry-meta">{{ entry.tools.length }} parent tool{{ entry.tools.length === 1 ? '' : 's' }}</span>
            </summary>

            <ul class="tool-list">
              <li v-for="tool in entry.tools" :key="tool.name" class="tool-row">
                <strong>{{ tool.name }}</strong>
                <span v-if="tool.children.length > 0" class="child-labels">
                  {{ tool.children.join(' · ') }}
                </span>
              </li>
            </ul>
          </details>
        </section>

        <footer class="paper-object attribution-card">
          <strong>{{ APP_NAME }}</strong>
          <p>{{ BETA_DESCRIPTION }}</p>
          <p>{{ CHART_ATTRIBUTION }}</p>
        </footer>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComponentPublicInstance } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';
import { APP_NAME, BETA_DESCRIPTION, CHART_ATTRIBUTION } from '@/constants/attribution';
import { CHART_CATEGORIES, CHART_FAMILIES, type ChartCategory, type ChartFamily } from '@/data/circleChartCatalog';
import { getToolCatalogCategory, type WeekendTool } from '@/data/toolCatalog';

interface LibraryEntry {
  category: ChartCategory;
  tools: readonly WeekendTool[];
}

interface FamilyGroup {
  family: ChartFamily;
  categories: LibraryEntry[];
}

const route = useRoute();

const categoryRefs = new Map<string, HTMLDetailsElement>();

const familyGroups = computed<FamilyGroup[]>(() =>
  CHART_FAMILIES.map((family) => ({
    family,
    categories: CHART_CATEGORIES.filter((category) => category.family === family.id).map((category) => ({
      category,
      tools: getToolCatalogCategory(category.id)?.tools ?? [],
    })),
  })).filter((group) => group.categories.length > 0),
);

const focusedCategoryId = ref<string | null>(readCategoryQuery());

watch(
  () => route.query.category,
  () => {
    focusedCategoryId.value = readCategoryQuery();
    scrollToFocusedCategory();
  },
);

function readCategoryQuery(): string | null {
  const value = route.query.category;
  const categoryId = Array.isArray(value) ? value[0] : value;
  if (!categoryId) return null;
  return CHART_CATEGORIES.some((category) => category.id === categoryId) ? categoryId : null;
}

function registerCategoryRef(categoryId: string, el: Element | ComponentPublicInstance | null): void {
  if (el instanceof HTMLDetailsElement) {
    categoryRefs.set(categoryId, el);
    if (categoryId === focusedCategoryId.value) {
      scrollToFocusedCategory();
    }
  } else {
    categoryRefs.delete(categoryId);
  }
}

function scrollToFocusedCategory(): void {
  const categoryId = focusedCategoryId.value;
  if (!categoryId) return;

  const target = categoryRefs.get(categoryId);
  if (!target) return;

  target.open = true;
  window.setTimeout(() => {
    target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, 80);
}
</script>

<style scoped>
.library-note {
  background: var(--surface);
  border: 1px dashed var(--border-subtle);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.45;
  margin: 0;
  padding: 12px 14px;
}

.family-shelf {
  display: grid;
  gap: 10px;
}

.family-kicker {
  align-items: center;
  display: flex;
  gap: 7px;
}

.family-dot {
  border-radius: 999px;
  display: inline-block;
  flex: 0 0 auto;
  height: 10px;
  width: 10px;
}

.category-entry {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 0;
  scroll-margin-top: 16px;
}

.category-entry summary {
  align-items: baseline;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  list-style: none;
  min-height: 44px;
  padding: 12px 14px;
}

.category-entry summary::-webkit-details-marker {
  display: none;
}

.category-entry summary::after {
  color: var(--text-secondary);
  content: '+';
  font-size: 1.1rem;
  font-weight: 800;
  margin-left: auto;
}

.category-entry[open] summary::after {
  content: '–';
}

.entry-name {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 800;
}

.entry-meta {
  color: var(--text-secondary);
  font-size: 0.76rem;
  font-weight: 700;
}

.tool-list {
  border-top: 1px solid var(--border-subtle);
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 12px 14px 14px;
}

.tool-row {
  display: grid;
  gap: 3px;
}

.tool-row strong {
  color: var(--text-primary);
  font-size: 0.92rem;
}

.child-labels {
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
}

.attribution-card {
  font-size: 0.84rem;
}

.attribution-card strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
}

.attribution-card p {
  color: var(--text-on-paper-soft);
  line-height: 1.45;
  margin: 6px 0 0;
}
</style>
