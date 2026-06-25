import { computed, ref } from 'vue';
import { ACTOR_STRUGGLES } from '@/data/actorStruggles';

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: readonly QuizOption[];
  correctOptionId: string | null;
  explanation: string | null;
}

export type QuizMode = 'browse' | 'multiple-choice';

export type QuizGradeStatus = 'answer-key-pending' | 'unanswered' | 'correct' | 'incorrect';

export interface QuizGrade {
  status: QuizGradeStatus;
  message: string;
  isGraded: boolean;
}

export const ANSWER_KEY_PENDING_COPY = 'Answer key pending';

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = ACTOR_STRUGGLES.map((struggle) => ({
  id: `quiz-${struggle.id}`,
  prompt: 'TBD',
  options: [],
  correctOptionId: null,
  explanation: null,
}));

const questionsRef = ref<readonly QuizQuestion[]>(QUIZ_QUESTIONS);
const currentQuestionIndexRef = ref(0);
const selectedAnswersRef = ref<Record<string, string | null>>({});
const modeRef = ref<QuizMode>('browse');

export const quizQuestions = computed(() => questionsRef.value);
export const currentQuestionIndex = computed(() => currentQuestionIndexRef.value);
export const selectedAnswers = computed(() => selectedAnswersRef.value);
export const quizMode = computed(() => modeRef.value);
export const currentQuestion = computed(() => questionsRef.value[currentQuestionIndexRef.value] ?? null);
export const currentSelection = computed(() => {
  const question = currentQuestion.value;
  if (!question) return null;
  return selectedAnswersRef.value[question.id] ?? null;
});
export const currentGrade = computed(() => {
  const question = currentQuestion.value;
  if (!question) return null;
  return gradeQuizAnswer(question, currentSelection.value);
});

export function setQuizMode(mode: QuizMode): void {
  modeRef.value = mode;
}

export function setQuizQuestions(questions: readonly QuizQuestion[]): void {
  questionsRef.value = questions;
  currentQuestionIndexRef.value = 0;
  selectedAnswersRef.value = {};
}

export function resetQuiz(): void {
  setQuizQuestions(QUIZ_QUESTIONS);
  modeRef.value = 'browse';
}

export function goToQuestion(index: number): void {
  if (questionsRef.value.length === 0) {
    currentQuestionIndexRef.value = 0;
    return;
  }

  currentQuestionIndexRef.value = Math.min(Math.max(index, 0), questionsRef.value.length - 1);
}

export function goToNextQuestion(): void {
  goToQuestion(currentQuestionIndexRef.value + 1);
}

export function goToPreviousQuestion(): void {
  goToQuestion(currentQuestionIndexRef.value - 1);
}

export function selectQuizAnswer(questionId: string, optionId: string): void {
  const question = questionsRef.value.find((candidate) => candidate.id === questionId);
  if (!question) return;
  if (!question.options.some((option) => option.id === optionId)) return;

  selectedAnswersRef.value = {
    ...selectedAnswersRef.value,
    [questionId]: optionId,
  };
}

export function isQuizAnswerSelected(questionId: string, optionId: string): boolean {
  return selectedAnswersRef.value[questionId] === optionId;
}

export function gradeQuizAnswer(question: QuizQuestion, selectedOptionId: string | null | undefined): QuizGrade {
  if (question.correctOptionId === null) {
    return {
      status: 'answer-key-pending',
      message: ANSWER_KEY_PENDING_COPY,
      isGraded: false,
    };
  }

  if (!selectedOptionId) {
    return {
      status: 'unanswered',
      message: 'Select an answer to check it.',
      isGraded: false,
    };
  }

  const isCorrect = selectedOptionId === question.correctOptionId;
  return {
    status: isCorrect ? 'correct' : 'incorrect',
    message: isCorrect ? 'Correct' : 'Not yet correct',
    isGraded: true,
  };
}
