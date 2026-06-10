<template>
  <ion-card class="tool-preview-card" :class="{ locked: practice.status === 'started' }">
    <ion-card-header>
      <ion-card-subtitle>{{ sourceLabel }} · {{ statusLabel }}</ion-card-subtitle>
      <ion-card-title>{{ practice.selectedTool.parentToolName }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <dl class="selection-details">
        <div>
          <dt>Chart area</dt>
          <dd>{{ practice.selectedTool.categoryName }}</dd>
        </div>
        <div v-if="practice.selectedTool.childToolName">
          <dt>Tool seed</dt>
          <dd>{{ practice.selectedTool.childToolName }}</dd>
        </div>
        <div v-if="practice.selectedTool.scaleValue">
          <dt>Scale</dt>
          <dd>{{ practice.selectedTool.scaleValue }}</dd>
        </div>
      </dl>

      <p class="neutral-note">
        Neutral taxonomy preview only. Starting today’s practice locks this selection to today’s POA path.
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
          This tool is locked for {{ practice.localDate }}. Use the Daily Action / POA card below to save and return to today’s note.
        </p>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import type { DailyPractice, PracticeSource } from '@/types/practice';

const props = defineProps<{
  practice: DailyPractice;
}>();

defineEmits<{
  (event: 'start'): void;
  (event: 'change'): void;
  (event: 'reroll'): void;
}>();

const sourceLabel = computed(() => sourceLabels[props.practice.source]);
const statusLabel = computed(() => (props.practice.status === 'started' ? 'Locked' : 'Preview'));

const sourceLabels: Record<PracticeSource, string> = {
  'self-selected': 'Pick My Own',
  random: 'Draw Random',
  'global-daily': 'Daily Tool',
};
</script>

<style scoped>
.tool-preview-card {
  --background: #fff8e8;
  border: 1px solid rgba(138, 92, 36, 0.2);
  box-shadow: none;
  margin: 16px 0 0;
}

.tool-preview-card.locked {
  --background: #eef7ed;
  border-color: rgba(55, 120, 72, 0.28);
}

.tool-preview-card ion-card-subtitle {
  color: #8a5c25;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.tool-preview-card ion-card-title {
  color: #2e1c0f;
  font-family: Georgia, 'Times New Roman', serif;
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
</style>
