<template>
  <ion-page>
    <ion-content class="chart-page">
      <main class="page-shell">
        <TopStatusBar />

        <header class="page-intro">
          <p class="kicker">Chart of Inspired Action</p>
          <h1>Chart</h1>
          <p class="page-subtitle">
            Quick access to the chart, its families, and tool basics. Deeper resources live in the Library.
          </p>
        </header>

        <CircleChart
          browse
          :show-directory="false"
          :selected-category-ids="[]"
          @open-category="openCategoryDetail"
        />

        <button class="journal-cta paper-object" type="button" @click="router.push('/journal')">
          <span class="cta-copy">
            <span class="cta-kicker">Today’s Practice</span>
            <strong>{{ journalCtaLabel }}</strong>
          </span>
          <ion-icon aria-hidden="true" :icon="arrowForwardOutline" />
        </button>

        <section class="studio-panel directory-panel" aria-labelledby="chart-directory-title">
          <p class="kicker">Chart areas</p>
          <h2 id="chart-directory-title">Categories at a glance</h2>

          <ul class="category-cards">
            <li v-for="category in CHART_CATEGORIES" :key="category.id">
              <div class="category-card">
                <button
                  class="category-open"
                  type="button"
                  aria-haspopup="dialog"
                  :aria-label="`${category.name}: open basics`"
                  @click="openCategoryDetail(category.id)"
                >
                  <span class="family-dot" :style="{ backgroundColor: getFamily(category.family).color }"></span>
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-meta">
                    {{ getFamily(category.family).label }} · {{ category.toolCount }} parent tool{{ category.toolCount === 1 ? '' : 's' }}
                  </span>
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
            </li>
          </ul>
        </section>

        <CategoryDetailSheet
          browse
          :is-open="isDetailOpen"
          :category-id="detailCategoryId"
          :included="false"
          :selected-tool-names="[]"
          :locked="false"
          @dismiss="isDetailOpen = false"
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';
import CategoryDetailSheet from '@/components/CategoryDetailSheet.vue';
import CircleChart from '@/components/CircleChart.vue';
import TopStatusBar from '@/components/TopStatusBar.vue';
import { CHART_ATTRIBUTION } from '@/constants/attribution';
import { CHART_CATEGORIES, getFamily } from '@/data/circleChartCatalog';
import { authStatus, currentUser, loadSession } from '@/stores/authStore';
import { getTodayPractice } from '@/stores/dailyPracticeStore';

const router = useRouter();

const detailCategoryId = ref<string | null>(null);
const isDetailOpen = ref(false);
const hasStartedPractice = ref(false);

const journalCtaLabel = computed(() =>
  hasStartedPractice.value ? 'Return to today’s practice' : 'Begin today’s practice in Journal',
);

onMounted(async () => {
  await loadSession();

  if (authStatus.value !== 'signed-in' || !currentUser.value) return;

  try {
    const practice = await getTodayPractice();
    hasStartedPractice.value = practice?.status === 'started';
  } catch {
    // Quiet on Chart: practice state detail belongs to Journal.
  }
});

function openCategoryDetail(categoryId: string): void {
  detailCategoryId.value = categoryId;
  isDetailOpen.value = true;
}

function openInLibrary(categoryId: string): void {
  isDetailOpen.value = false;
  router.push({ path: '/library', query: { category: categoryId } });
}
</script>

<style scoped>
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

.directory-panel h2 {
  margin-top: 6px;
}

.category-cards {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-card {
  align-items: center;
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  display: flex;
  gap: 8px;
  padding: 4px 8px 4px 4px;
}

.category-open {
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
}

.category-meta {
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  grid-column: 2;
}

.library-link {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--accent-primary);
  flex: 0 0 auto;
  font-size: 0.74rem;
  font-weight: 800;
  min-height: 40px;
  padding: 8px 12px;
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
