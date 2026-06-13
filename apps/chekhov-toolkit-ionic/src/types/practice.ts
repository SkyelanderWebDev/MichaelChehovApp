export type PracticeSource = 'self-selected' | 'random' | 'global-daily';

export interface PracticeToolSelection {
  categoryId: string;
  categoryName: string;
  parentToolName: string;
  childToolName?: string | null;
  scaleValue?: number | null;
  unveiledValue?: number | null;
}

export interface DailyPractice {
  id: string;
  localDate: string;
  source: PracticeSource;
  status: 'preview' | 'started';
  selectedTool: PracticeToolSelection;
  poaEntry?: POAEntry | null;
  startedAt?: string;
  updatedAt: string;
}

export interface POAEntry {
  dailyPracticeId: string;
  mode: 'structured' | 'journal';
  practiceNotes: string;
  observeMorning: string;
  observeMidday: string;
  observeEvening: string;
  applyMorning: string;
  applyMidday: string;
  applyEvening: string;
  journalText: string;
  updatedAt: string;
}

export type POADraft = Omit<POAEntry, 'dailyPracticeId' | 'updatedAt'>;
