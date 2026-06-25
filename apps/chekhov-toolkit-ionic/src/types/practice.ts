export type PracticeSource = 'self-selected' | 'random' | 'global-daily';

export interface PracticeToolSelection {
  categoryId: string;
  categoryName: string;
  parentToolName: string;
  childToolName?: string | null;
  components?: PracticeToolComponent[];
  scaleValue?: number | null;
  unveiledValue?: number | null;
}

export interface PracticeToolComponent {
  label: string;
  value: string;
}

export type PracticeStatus = 'preview' | 'started' | 'completed';

export interface DailyPractice {
  id: string;
  localDate: string;
  source: PracticeSource;
  status: PracticeStatus;
  selectedTool: PracticeToolSelection;
  poaEntry?: POAEntry | null;
  startedAt?: string;
  completedAt?: string;
  flybackNote?: string;
  updatedAt: string;
}

/**
 * Append-only log of every Journal draw / re-roll / pick.
 * One row per roll; never updated or relaxed by upsert.
 */
export interface DrawHistoryEntry {
  id: string;
  localDate: string;
  source: PracticeSource;
  selectedTool: PracticeToolSelection;
  drawnAt: string;
}

/**
 * Timestamped reflection note appended AFTER a day's POA is locked.
 * The core POA stays immutable; notes accrete.
 */
export interface POANote {
  id: string;
  dailyPracticeId: string;
  note: string;
  createdAt: string;
}

/** A past practice day assembled for the read-only History browse. */
export interface PracticeHistoryDay {
  practice: DailyPractice;
  poa: POAEntry | null;
  draws: DrawHistoryEntry[];
  notes: POANote[];
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
