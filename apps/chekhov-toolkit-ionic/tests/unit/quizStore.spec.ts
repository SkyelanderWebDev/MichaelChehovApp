import { describe, expect, it } from 'vitest';
import { ANSWER_KEY_PENDING_COPY, gradeQuizAnswer, type QuizQuestion } from '@/stores/quizStore';

const pendingQuestion: QuizQuestion = {
  id: 'quiz-problem-01',
  prompt: 'TBD',
  options: [],
  correctOptionId: null,
  explanation: null,
};

describe('quiz engine answer-key behavior', () => {
  it('does not grade a selected answer when the answer key is pending', () => {
    const result = gradeQuizAnswer(
      {
        ...pendingQuestion,
        options: [{ id: 'option-a', label: 'TBD' }],
      },
      'option-a',
    );

    expect(result).toEqual({
      status: 'answer-key-pending',
      message: ANSWER_KEY_PENDING_COPY,
      isGraded: false,
    });
  });

  it('handles empty placeholder options without grading or throwing', () => {
    expect(() => gradeQuizAnswer(pendingQuestion, null)).not.toThrow();
    expect(gradeQuizAnswer(pendingQuestion, null)).toMatchObject({
      status: 'answer-key-pending',
      isGraded: false,
    });
  });

  it('grades only after a non-null answer key is supplied', () => {
    const keyedQuestion: QuizQuestion = {
      id: 'quiz-problem-01',
      prompt: 'TBD',
      options: [
        { id: 'option-a', label: 'TBD' },
        { id: 'option-b', label: 'TBD' },
      ],
      correctOptionId: 'option-b',
      explanation: null,
    };

    expect(gradeQuizAnswer(keyedQuestion, 'option-b')).toMatchObject({ status: 'correct', isGraded: true });
    expect(gradeQuizAnswer(keyedQuestion, 'option-a')).toMatchObject({ status: 'incorrect', isGraded: true });
  });
});
