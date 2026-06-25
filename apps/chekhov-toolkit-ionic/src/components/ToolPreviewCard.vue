<template>
  <ion-card class="tool-preview-card" :class="{ locked: practice.status === 'started' }">
    <ion-card-header>
      <ion-card-subtitle>{{ sourceLabel }} · {{ statusLabel }}</ion-card-subtitle>
      <ion-card-title>{{ cardTitle }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <p v-if="areaDescription" class="area-description" data-testid="preview-area-description">
        {{ areaDescription }}
      </p>

      <dl class="selection-details">
        <div>
          <dt>Chart area</dt>
          <dd>{{ practice.selectedTool.categoryName }}</dd>
        </div>
        <div v-if="practice.selectedTool.childToolName && !practice.selectedTool.components?.length">
          <dt>Tool seed</dt>
          <dd>{{ practice.selectedTool.childToolName }}</dd>
        </div>
        <div v-if="practice.selectedTool.components?.length" class="component-detail">
          <dt>Components</dt>
          <dd>
            <span v-for="component in practice.selectedTool.components" :key="component.label">
              <small>{{ component.label }}</small>
              <b>{{ component.value }}</b>
            </span>
          </dd>
        </div>
        <div v-if="practice.selectedTool.scaleValue">
          <dt>Tempo #</dt>
          <dd>{{ practice.selectedTool.scaleValue }}</dd>
        </div>
        <div v-if="practice.selectedTool.unveiledValue">
          <dt>Veiling</dt>
          <dd>{{ practice.selectedTool.unveiledValue }}</dd>
        </div>
      </dl>

      <p class="neutral-note">
        Starting today’s practice links this selection to today’s POA path.
      </p>

      <div v-if="practice.status === 'preview'" class="preview-actions">
        <ion-button color="primary" expand="block" @click="$emit('start')">
          Start Today’s Practice
        </ion-button>
        <ion-button fill="outline" color="medium" expand="block" @click="$emit('change')">
          Change chart area
        </ion-button>
        <ion-button fill="clear" color="medium" expand="block" @click="$emit('reroll')">
          Draw another preview
        </ion-button>
      </div>

      <div v-else class="locked-state" aria-live="polite">
        <strong>Today’s practice is started.</strong>
        <p>
          Use the Daily Action / POA card below to save and return to today’s note. If this is not the tool you meant to choose, unlock it and pick again.
        </p>
        <ion-button fill="outline" color="medium" expand="block" @click="$emit('unlock')">
          Unlock and change tool
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import { CHART_CATEGORIES } from '@/data/circleChartCatalog';
import type { DailyPractice, PracticeSource } from '@/types/practice';

const props = defineProps<{
  practice: DailyPractice;
}>();

// Sanctioned NMCA/source chart-area description, keyed by the selection's categoryId.
// Presentation only — no AI-invented practice text.
const areaDescription = computed(
  () =>
    CHART_CATEGORIES.find((category) => category.id === props.practice.selectedTool.categoryId)?.description ?? '',
);

defineEmits<{
  (event: 'start'): void;
  (event: 'change'): void;
  (event: 'reroll'): void;
  (event: 'unlock'): void;
}>();

const sourceLabel = computed(() => sourceLabels[props.practice.source]);
const statusLabel = computed(() => (props.practice.status === 'started' ? 'Started' : 'Preview'));
const cardTitle = computed(() =>
  props.practice.selectedTool.components?.length
    ? props.practice.selectedTool.categoryName
    : props.practice.selectedTool.parentToolName,
);

const sourceLabels: Record<PracticeSource, string> = {
  'self-selected': 'Pick My Own',
  random: 'Draw Random',
  'global-daily': 'Daily Tool',
};
</script>

<style scoped>
.tool-preview-card {
  --background: var(--surface-paper-soft, #fff8e8);
  border: 1px solid rgba(198, 146, 62, 0.55);
  border-radius: var(--radius-card);
  /* Preview state: warm brass glow, not warning yellow. */
  box-shadow: 0 0 0 4px var(--accent-soft), var(--shadow-card);
  margin: 0;
}

.tool-preview-card.locked {
  --background: #eef7ed;
  border-color: rgba(111, 135, 88, 0.6);
  box-shadow: 0 0 0 4px rgba(111, 135, 88, 0.18), var(--shadow-card);
}

.tool-preview-card ion-card-subtitle {
  color: #8a5c25;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.tool-preview-card ion-card-title {
  color: #2e1c0f;
  font-family: var(--font-display);
}

.area-description {
  color: rgba(55, 36, 22, 0.78);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 0 12px;
  overflow-wrap: anywhere;
  text-wrap: pretty;
}

.selection-details {
  display: grid;
  gap: 10px;
  margin: 0;
}

.selection-details div {
  background: rgba(55, 36, 22, 0.05);
  border-radius: 14px;
  padding: 10px 12px;
}

.selection-details dt {
  color: rgba(55, 36, 22, 0.58);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.selection-details dd {
  color: #372416;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.25;
  margin: 4px 0 0;
}

.component-detail dd {
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.component-detail span {
  background: rgba(255, 253, 247, 0.7);
  border: 1px solid rgba(75, 52, 29, 0.12);
  border-radius: 12px;
  display: grid;
  gap: 2px;
  min-width: 0;
  padding: 8px;
}

.component-detail small {
  color: rgba(55, 36, 22, 0.6);
  font-size: 0.64rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.component-detail b {
  color: #372416;
  font-size: 0.82rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.neutral-note,
.locked-state p {
  color: rgba(55, 36, 22, 0.72);
  line-height: 1.45;
}

.neutral-note {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 12px 0;
}

.preview-actions {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.locked-state {
  background: rgba(55, 120, 72, 0.12);
  border: 1px solid rgba(55, 120, 72, 0.2);
  border-radius: 16px;
  color: #244a2e;
  margin-top: 12px;
  padding: 12px;
}

.locked-state strong {
  display: block;
  margin-bottom: 4px;
}

.locked-state p {
  margin: 0;
}

.locked-state ion-button {
  margin-top: 12px;
}
</style>
