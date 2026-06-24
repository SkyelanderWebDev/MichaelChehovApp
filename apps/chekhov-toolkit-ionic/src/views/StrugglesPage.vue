<template>
  <ion-page>
    <ion-content class="struggles-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Skeleton</p>
          <h1>Common Actor Struggles</h1>
          <p class="page-subtitle">
            A placeholder index for 39 sourced acting-problem slots. Real titles, remedies, and tool mappings are pending clearance.
          </p>
        </header>

        <SourceAttributionLine />

        <section class="studio-panel struggle-detail" aria-labelledby="selected-struggle-title">
          <p class="kicker">{{ selectedStruggle?.sourceRef ?? 'No source slot selected' }}</p>
          <h2 id="selected-struggle-title">{{ selectedStruggle?.problemTitle ?? PENDING_LISA_CLEARANCE_COPY }}</h2>

          <dl v-if="selectedStruggle" class="detail-list">
            <div>
              <dt>Problem title</dt>
              <dd>{{ selectedStruggle.problemTitle }}</dd>
            </div>
            <div>
              <dt>Related tool</dt>
              <dd>{{ selectedStruggle.relatedToolName }}</dd>
            </div>
            <div>
              <dt>Remedy slot</dt>
              <dd>{{ PENDING_LISA_CLEARANCE_COPY }}</dd>
            </div>
          </dl>

          <p v-else class="panel-copy">{{ PENDING_LISA_CLEARANCE_COPY }}</p>
        </section>

        <section class="studio-panel struggles-list-panel" aria-labelledby="struggles-list-title">
          <div class="list-heading">
            <div>
              <p class="kicker">Problems in Acting</p>
              <h2 id="struggles-list-title">39 placeholder entries</h2>
            </div>
            <span class="status-pill">{{ ACTOR_STRUGGLES.length }} slots</span>
          </div>

          <ol class="struggles-list">
            <li v-for="struggle in ACTOR_STRUGGLES" :key="struggle.id">
              <button
                class="struggle-row"
                type="button"
                :class="{ selected: struggle.id === selectedStruggleId }"
                :aria-current="struggle.id === selectedStruggleId ? 'true' : undefined"
                @click="selectedStruggleId = struggle.id"
              >
                <span class="row-index">{{ struggle.sourceRef.replace('NMCA Problems in Acting #', '#') }}</span>
                <span class="row-copy">
                  <strong>{{ struggle.problemTitle }}</strong>
                  <small>Related tool: {{ struggle.relatedToolName }}</small>
                </span>
              </button>
            </li>
          </ol>
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import SourceAttributionLine from '@/components/struggles/SourceAttributionLine.vue';
import { ACTOR_STRUGGLES, PENDING_LISA_CLEARANCE_COPY } from '@/data/actorStruggles';

const selectedStruggleId = ref(ACTOR_STRUGGLES[0]?.id ?? null);

const selectedStruggle = computed(() =>
  ACTOR_STRUGGLES.find((struggle) => struggle.id === selectedStruggleId.value) ?? null,
);
</script>

<style scoped>
.struggle-detail {
  display: grid;
  gap: 12px;
}

.detail-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.detail-list div {
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 10px 12px;
}

.detail-list dt {
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.detail-list dd {
  color: var(--text-primary);
  font-size: 0.94rem;
  line-height: 1.4;
  margin: 0;
}

.struggles-list-panel {
  display: grid;
  gap: 12px;
}

.list-heading {
  align-items: start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.struggles-list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.struggle-row {
  align-items: center;
  background: var(--app-bg-2);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  color: var(--text-primary);
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: auto minmax(0, 1fr);
  min-height: 58px;
  padding: 10px 12px;
  text-align: left;
  width: 100%;
}

.struggle-row.selected {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.row-index {
  align-items: center;
  background: var(--surface);
  border-radius: 999px;
  color: var(--accent-primary);
  display: inline-flex;
  font-size: 0.74rem;
  font-weight: 900;
  height: 34px;
  justify-content: center;
  width: 42px;
}

.row-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.row-copy strong {
  overflow-wrap: anywhere;
}

.row-copy small {
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.35;
}
</style>
