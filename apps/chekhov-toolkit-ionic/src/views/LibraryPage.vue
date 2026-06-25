<template>
  <ion-page>
    <ion-content class="library-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Source-grounded reference</p>
          <h1>Library</h1>
          <p class="page-subtitle">
            Browse the Chart of Inspired Action and trusted resource paths for deeper study.
          </p>
        </header>

        <p class="library-note">
          This first Library pass keeps the chart tools close at hand while deeper videos, writings, and excerpts are prepared.
        </p>

        <section class="library-section" aria-labelledby="dive-deeper-title">
          <div class="section-heading">
            <p class="kicker">Chart tools</p>
            <h2 id="dive-deeper-title">Dive Deeper into the Tools</h2>
          </div>

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

              <div class="entry-body">
                <p v-if="entry.category.description" class="entry-description">{{ entry.category.description }}</p>

                <ul class="tool-list">
                  <li v-for="tool in entry.tools" :key="tool.name" class="tool-row">
                    <strong>{{ tool.name }}</strong>
                    <span v-if="tool.scope" class="scope-note">{{ formatScope(tool.scope) }}</span>
                    <span v-if="tool.children.length > 0" class="child-labels">
                      {{ tool.children.join(' · ') }}
                    </span>
                  </li>
                </ul>
              </div>
            </details>
          </section>
        </section>

        <section class="library-section" aria-labelledby="resource-buckets-title">
          <div class="section-heading">
            <p class="kicker">Study paths</p>
            <h2 id="resource-buckets-title">Resources</h2>
          </div>

          <div class="resource-grid">
            <article v-for="bucket in resourceBuckets" :key="bucket.title" class="studio-panel resource-card">
              <h3>{{ bucket.title }}</h3>
              <p>{{ bucket.placeholder }}</p>
              <a v-if="bucket.href" :href="bucket.href" target="_blank" rel="noreferrer">
                Open resource
              </a>
            </article>

            <article class="studio-panel resource-card" aria-label="Common Struggles, coming soon">
              <h3>Common Struggles</h3>
              <p>Coming soon. Dawson and Lisa Dalton are preparing this material.</p>
            </article>
          </div>
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

interface ResourceBucket {
  title: string;
  placeholder: string;
  href?: string;
}

const resourceBuckets: ResourceBucket[] = [
  {
    title: 'Lisa’s YouTube',
    placeholder: 'Lisa Dalton’s public Michael Chekhov video library.',
    href: 'https://www.youtube.com/c/LisaDaltonandMichaelChekhov/videos',
  },
  { title: 'Videos & Demonstrations', placeholder: 'More demonstrations and class clips coming soon.' },
  { title: 'Chekhov Lectures & Writings', placeholder: 'More lecture and writing references coming soon.' },
  { title: 'Lisa Dalton / NMCA Books & Excerpts', placeholder: 'More book and excerpt references coming soon.' },
  {
    title: 'Windsor University’s Michael Chekhov Archive',
    placeholder: 'University of Windsor archive overview for Michael Chekhov materials.',
    href: 'https://collections.uwindsor.ca/chekhov/about',
  },
];

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

function formatScope(scope: WeekendTool['scope']): string {
  if (scope === 'full-body') return 'full body';
  if (scope === 'parts') return 'parts';
  return 'full body + parts';
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

.library-section {
  display: grid;
  gap: 12px;
}

.section-heading h2 {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 6vw, 1.85rem);
  font-weight: 600;
  line-height: 1.06;
  margin: 6px 0 0;
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

.entry-body {
  border-top: 1px solid var(--border-subtle);
  display: grid;
  gap: 10px;
  padding: 12px 14px 14px;
}

.entry-description {
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 650;
  line-height: 1.45;
  margin: 0;
}

.tool-list {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tool-row {
  display: grid;
  gap: 3px;
}

.tool-row strong {
  color: var(--text-primary);
  font-size: 0.92rem;
}

.scope-note {
  color: #244a2e;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.child-labels {
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
}

.resource-grid {
  display: grid;
  gap: 10px;
}

.resource-card {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.resource-card > * {
  min-width: 0;
}

.resource-card h3 {
  color: var(--text-primary);
  font-size: 1rem;
  margin: 0;
}

.resource-card p {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.45;
  margin: 0;
  overflow-wrap: anywhere;
}

.resource-card a {
  align-self: start;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--accent-primary);
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 900;
  justify-content: center;
  margin-top: 4px;
  max-width: 100%;
  min-height: 38px;
  padding: 9px 12px;
  position: static;
  text-decoration: none;
  white-space: normal;
  width: fit-content;
}

.resource-card a:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
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

@media (min-width: 760px) {
  .resource-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .resource-card a {
    align-self: stretch;
    width: 100%;
  }
}
</style>
