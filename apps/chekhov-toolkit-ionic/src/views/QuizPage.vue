<template>
  <ion-page>
    <ion-content class="quiz-page">
      <main class="page-shell">
        <header class="page-intro">
          <p class="kicker">Skeleton</p>
          <h1>Quiz</h1>
          <p class="page-subtitle">
            Placeholder quiz structure for later Lisa-cleared prompts, choices, and answer key.
          </p>
        </header>

        <SourceAttributionLine />

        <section class="studio-panel quiz-mode-panel" aria-label="Quiz mode">
          <button
            type="button"
            :class="{ active: quizMode === 'browse' }"
            :aria-pressed="quizMode === 'browse'"
            @click="setQuizMode('browse')"
          >
            Browse list
          </button>
          <button
            type="button"
            :class="{ active: quizMode === 'multiple-choice' }"
            :aria-pressed="quizMode === 'multiple-choice'"
            @click="setQuizMode('multiple-choice')"
          >
            Multiple choice
          </button>
        </section>

        <section v-if="quizMode === 'browse'" class="studio-panel quiz-list-panel" aria-labelledby="quiz-list-title">
          <div class="list-heading">
            <div>
              <p class="kicker">Question bank</p>
              <h2 id="quiz-list-title">39 placeholder questions</h2>
            </div>
            <span class="status-pill">{{ quizQuestions.length }} slots</span>
          </div>

          <ol class="quiz-list">
            <li v-for="(question, index) in quizQuestions" :key="question.id">
              <button class="quiz-row" type="button" @click="openQuestion(index)">
                <span class="row-index">#{{ index + 1 }}</span>
                <span class="row-copy">
                  <strong>{{ question.prompt }}</strong>
                  <small>{{ gradeQuizAnswer(question, selectedAnswers[question.id]).message }}</small>
                </span>
              </button>
            </li>
          </ol>
        </section>

        <section v-else class="paper-object question-card" aria-labelledby="current-question-title">
          <div class="question-progress">
            <p class="kicker">Question {{ currentQuestionIndex + 1 }} of {{ quizQuestions.length }}</p>
            <span class="status-pill">{{ currentGrade?.message ?? ANSWER_KEY_PENDING_COPY }}</span>
          </div>

          <h2 id="current-question-title">{{ currentQuestion?.prompt ?? PENDING_LISA_CLEARANCE_COPY }}</h2>

          <div v-if="currentQuestion && currentQuestion.options.length > 0" class="option-list" role="group" aria-label="Answer choices">
            <button
              v-for="option in currentQuestion.options"
              :key="option.id"
              class="answer-option"
              type="button"
              :class="{ selected: isQuizAnswerSelected(currentQuestion.id, option.id) }"
              :aria-pressed="isQuizAnswerSelected(currentQuestion.id, option.id)"
              @click="selectQuizAnswer(currentQuestion.id, option.id)"
            >
              {{ option.label }}
            </button>
          </div>

          <p v-else class="pending-options" role="status">
            {{ PENDING_LISA_CLEARANCE_COPY }}
          </p>

          <p class="grade-copy" :class="currentGrade?.status" role="status">
            {{ currentGrade?.message ?? ANSWER_KEY_PENDING_COPY }}
          </p>

          <p v-if="currentQuestion?.explanation" class="explanation-copy">{{ currentQuestion.explanation }}</p>

          <div class="question-actions">
            <ion-button fill="outline" color="medium" :disabled="currentQuestionIndex === 0" @click="goToPreviousQuestion">
              Previous
            </ion-button>
            <ion-button
              color="primary"
              :disabled="currentQuestionIndex >= quizQuestions.length - 1"
              @click="goToNextQuestion"
            >
              Next
            </ion-button>
          </div>
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import SourceAttributionLine from '@/components/struggles/SourceAttributionLine.vue';
import { PENDING_LISA_CLEARANCE_COPY } from '@/data/actorStruggles';
import {
  ANSWER_KEY_PENDING_COPY,
  currentGrade,
  currentQuestion,
  currentQuestionIndex,
  goToNextQuestion,
  goToPreviousQuestion,
  goToQuestion,
  gradeQuizAnswer,
  isQuizAnswerSelected,
  quizMode,
  quizQuestions,
  selectedAnswers,
  selectQuizAnswer,
  setQuizMode,
} from '@/stores/quizStore';

function openQuestion(index: number): void {
  goToQuestion(index);
  setQuizMode('multiple-choice');
}
</script>

<style scoped>
.quiz-mode-panel {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 8px;
}

.quiz-mode-panel button {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 800;
  min-height: 44px;
  padding: 10px 8px;
}

.quiz-mode-panel button.active {
  background: var(--accent-soft);
  border-color: var(--border-subtle);
  color: var(--text-primary);
}

.quiz-list-panel {
  display: grid;
  gap: 12px;
}

.list-heading,
.question-progress {
  align-items: start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.quiz-list {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.quiz-row {
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

.question-card {
  display: grid;
  gap: 14px;
}

.question-card h2 {
  font-size: clamp(1.35rem, 6vw, 1.8rem);
}

.option-list {
  display: grid;
  gap: 8px;
}

.answer-option {
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid var(--border-on-paper);
  border-radius: 14px;
  color: var(--text-on-paper);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  min-height: 48px;
  padding: 12px;
  text-align: left;
}

.answer-option.selected {
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.pending-options,
.grade-copy,
.explanation-copy {
  color: var(--text-on-paper);
  font-size: 0.92rem;
  line-height: 1.45;
  margin: 0;
}

.grade-copy {
  border-top: 1px solid var(--border-on-paper);
  font-weight: 800;
  padding-top: 12px;
}

.grade-copy.correct {
  color: var(--success-text, var(--text-on-paper));
}

.grade-copy.incorrect {
  color: var(--danger-text, var(--text-on-paper));
}

.question-actions {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
