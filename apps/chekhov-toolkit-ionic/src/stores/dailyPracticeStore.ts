import { requireSupabase, supabase } from '@/lib/supabaseClient';
import type {
  DailyPractice,
  DrawHistoryEntry,
  POAEntry,
  POANote,
  PracticeHistoryDay,
  PracticeSource,
  PracticeStatus,
  PracticeToolSelection,
} from '@/types/practice';

const DAILY_PRACTICE_COLUMNS =
  'id, local_date, source, status, selected_tool, started_at, completed_at, flyback_note, updated_at';

interface DailyPracticeRow {
  id: string;
  local_date: string;
  source: PracticeSource;
  status: PracticeStatus;
  selected_tool: PracticeToolSelection;
  started_at: string | null;
  completed_at: string | null;
  flyback_note: string | null;
  updated_at: string;
}

interface DrawHistoryRow {
  id: string;
  local_date: string;
  source: PracticeSource;
  selected_tool: PracticeToolSelection;
  drawn_at: string;
}

interface POANoteRow {
  id: string;
  daily_practice_id: string;
  note: string;
  created_at: string;
}

interface POAEntryRow {
  daily_practice_id: string;
  mode: 'structured' | 'journal';
  practice_notes: string | null;
  observe_morning: string | null;
  observe_midday: string | null;
  observe_evening: string | null;
  apply_morning: string | null;
  apply_midday: string | null;
  apply_evening: string | null;
  journal_text: string | null;
  updated_at: string;
}

export function getLocalDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function getTodayPractice(localDate = getLocalDate()): Promise<DailyPractice | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const { data, error } = await requireSupabase()
    .from('daily_practices')
    .select(DAILY_PRACTICE_COLUMNS)
    .eq('user_id', userId)
    .eq('local_date', localDate)
    .maybeSingle();

  if (error) throw error;

  return data ? mapDailyPracticeRow(data as DailyPracticeRow) : null;
}

export async function setPreview(
  selectedTool: PracticeToolSelection,
  source: PracticeSource,
  localDate = getLocalDate(),
): Promise<DailyPractice | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const existing = await getTodayPractice(localDate);
  // Once a day is started or completed it is locked; never overwrite it back to a
  // fresh preview.
  if (existing && existing.status !== 'preview') {
    return existing;
  }

  const payload = {
    user_id: userId,
    local_date: localDate,
    source,
    status: 'preview',
    category_id: selectedTool.categoryId,
    category_name: selectedTool.categoryName,
    parent_tool_name: selectedTool.parentToolName,
    child_tool_name: selectedTool.childToolName ?? null,
    scale_value: selectedTool.scaleValue ?? null,
    unveiled_value: selectedTool.unveiledValue ?? null,
    selected_tool: selectedTool,
  };

  const { data, error } = await requireSupabase()
    .from('daily_practices')
    .upsert(payload, { onConflict: 'user_id,local_date' })
    .select(DAILY_PRACTICE_COLUMNS)
    .single();

  if (error) throw error;

  // F1 DRAW HISTORY: log EVERY roll (draw / re-roll / pick) as an append-only
  // row. This is additive to the upserted daily_practices row.
  await logDraw(userId, selectedTool, source, localDate);

  return mapDailyPracticeRow(data as DailyPracticeRow);
}

async function logDraw(
  userId: string,
  selectedTool: PracticeToolSelection,
  source: PracticeSource,
  localDate: string,
): Promise<void> {
  const { error } = await requireSupabase()
    .from('draw_history')
    .insert({
      user_id: userId,
      local_date: localDate,
      source,
      selected_tool: selectedTool,
    });

  if (error) throw error;
}

export async function startTodayPractice(localDate = getLocalDate()): Promise<DailyPractice | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const existing = await getTodayPractice(localDate);
  if (!existing) return null;
  if (existing.status === 'started') return existing;

  const { data, error } = await requireSupabase()
    .from('daily_practices')
    .update({ status: 'started', started_at: new Date().toISOString() })
    .eq('id', existing.id)
    .eq('user_id', userId)
    .select(DAILY_PRACTICE_COLUMNS)
    .single();

  if (error) throw error;

  return mapDailyPracticeRow(data as DailyPracticeRow);
}

export async function unlockTodayPractice(localDate = getLocalDate()): Promise<DailyPractice | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const existing = await getTodayPractice(localDate);
  if (!existing) return null;
  if (existing.status === 'preview') return existing;

  const { data, error } = await requireSupabase()
    .from('daily_practices')
    .update({ status: 'preview', started_at: null })
    .eq('id', existing.id)
    .eq('user_id', userId)
    .select(DAILY_PRACTICE_COLUMNS)
    .single();

  if (error) throw error;

  return mapDailyPracticeRow(data as DailyPracticeRow);
}

/**
 * F1 POA LOCK: explicit "Complete Practice" tap. Locks the day by moving a
 * started practice to `completed`. After this the core POA is read-only; only
 * append-only post-lock notes may be added. Reload restores this locked state.
 */
export async function completeTodayPractice(localDate = getLocalDate()): Promise<DailyPractice | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const existing = await getTodayPractice(localDate);
  if (!existing) return null;
  if (existing.status === 'completed') return existing;
  if (existing.status !== 'started') return existing;

  const { data, error } = await requireSupabase()
    .from('daily_practices')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', existing.id)
    .eq('user_id', userId)
    .select(DAILY_PRACTICE_COLUMNS)
    .single();

  if (error) throw error;

  return mapDailyPracticeRow(data as DailyPracticeRow);
}

/**
 * G3 FLYBACK: persist a lightweight per-day reflection note, distinct from the
 * full POA. Editable while the day is not yet completed.
 */
export async function saveFlybackNote(note: string, localDate = getLocalDate()): Promise<DailyPractice | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const existing = await getTodayPractice(localDate);
  if (!existing || existing.status === 'completed') return existing;

  const { data, error } = await requireSupabase()
    .from('daily_practices')
    .update({ flyback_note: note })
    .eq('id', existing.id)
    .eq('user_id', userId)
    .select(DAILY_PRACTICE_COLUMNS)
    .single();

  if (error) throw error;

  return mapDailyPracticeRow(data as DailyPracticeRow);
}

/**
 * F1 POST-LOCK NOTES: append a timestamped note to a (locked) practice. The core
 * POA stays immutable; notes accrete in draw order.
 */
export async function addPOANote(dailyPracticeId: string, note: string): Promise<POANote | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const trimmed = note.trim();
  if (!trimmed) return null;

  const { data, error } = await requireSupabase()
    .from('poa_notes')
    .insert({ user_id: userId, daily_practice_id: dailyPracticeId, note: trimmed })
    .select('id, daily_practice_id, note, created_at')
    .single();

  if (error) throw error;

  return mapPOANoteRow(data as POANoteRow);
}

export async function getPOANotes(dailyPracticeId: string): Promise<POANote[]> {
  const userId = await getSignedInUserId();
  if (!userId) return [];

  const { data, error } = await requireSupabase()
    .from('poa_notes')
    .select('id, daily_practice_id, note, created_at')
    .eq('user_id', userId)
    .eq('daily_practice_id', dailyPracticeId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data as POANoteRow[]).map(mapPOANoteRow);
}

export async function getDrawHistory(localDate?: string): Promise<DrawHistoryEntry[]> {
  const userId = await getSignedInUserId();
  if (!userId) return [];

  let query = requireSupabase()
    .from('draw_history')
    .select('id, local_date, source, selected_tool, drawn_at')
    .eq('user_id', userId);

  if (localDate) {
    query = query.eq('local_date', localDate);
  }

  const { data, error } = await query.order('drawn_at', { ascending: false });

  if (error) throw error;

  return (data as DrawHistoryRow[]).map(mapDrawHistoryRow);
}

/**
 * F1 HISTORY: assemble past practice days for the read-only History browse. Each
 * day carries its locked POA, that day's full draw log, and any post-lock notes.
 */
export async function getPracticeHistory(): Promise<PracticeHistoryDay[]> {
  const userId = await getSignedInUserId();
  if (!userId) return [];

  const client = requireSupabase();

  const [practicesResult, poaResult, drawsResult, notesResult] = await Promise.all([
    client
      .from('daily_practices')
      .select(DAILY_PRACTICE_COLUMNS)
      .eq('user_id', userId)
      .order('local_date', { ascending: false }),
    client
      .from('poa_entries')
      .select('daily_practice_id, mode, practice_notes, observe_morning, observe_midday, observe_evening, apply_morning, apply_midday, apply_evening, journal_text, updated_at')
      .eq('user_id', userId),
    client
      .from('draw_history')
      .select('id, local_date, source, selected_tool, drawn_at')
      .eq('user_id', userId)
      .order('drawn_at', { ascending: false }),
    client
      .from('poa_notes')
      .select('id, daily_practice_id, note, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
  ]);

  if (practicesResult.error) throw practicesResult.error;
  if (poaResult.error) throw poaResult.error;
  if (drawsResult.error) throw drawsResult.error;
  if (notesResult.error) throw notesResult.error;

  const poaByPractice = new Map<string, POAEntry>();
  for (const row of poaResult.data as POAEntryRow[]) {
    poaByPractice.set(row.daily_practice_id, mapPOAEntryRow(row));
  }

  const notesByPractice = new Map<string, POANote[]>();
  for (const row of notesResult.data as POANoteRow[]) {
    const note = mapPOANoteRow(row);
    const bucket = notesByPractice.get(note.dailyPracticeId) ?? [];
    bucket.push(note);
    notesByPractice.set(note.dailyPracticeId, bucket);
  }

  const drawsByDate = new Map<string, DrawHistoryEntry[]>();
  for (const row of drawsResult.data as DrawHistoryRow[]) {
    const draw = mapDrawHistoryRow(row);
    const bucket = drawsByDate.get(draw.localDate) ?? [];
    bucket.push(draw);
    drawsByDate.set(draw.localDate, bucket);
  }

  return (practicesResult.data as DailyPracticeRow[]).map((row) => {
    const practice = mapDailyPracticeRow(row);
    return {
      practice,
      poa: poaByPractice.get(practice.id) ?? null,
      draws: drawsByDate.get(practice.localDate) ?? [],
      notes: notesByPractice.get(practice.id) ?? [],
    };
  });
}

export async function getPOA(dailyPracticeId: string): Promise<POAEntry | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const { data, error } = await requireSupabase()
    .from('poa_entries')
    .select('daily_practice_id, mode, practice_notes, observe_morning, observe_midday, observe_evening, apply_morning, apply_midday, apply_evening, journal_text, updated_at')
    .eq('user_id', userId)
    .eq('daily_practice_id', dailyPracticeId)
    .maybeSingle();

  if (error) throw error;

  return data ? mapPOAEntryRow(data as POAEntryRow) : null;
}

export async function clearTodayPracticePreview(localDate = getLocalDate()): Promise<void> {
  const userId = await getSignedInUserId();
  if (!userId) return;

  const { error } = await requireSupabase()
    .from('daily_practices')
    .delete()
    .eq('user_id', userId)
    .eq('local_date', localDate)
    .eq('status', 'preview');

  if (error) throw error;
}

export async function savePOA(entry: Omit<POAEntry, 'updatedAt'>): Promise<POAEntry | null> {
  const userId = await getSignedInUserId();
  if (!userId) return null;

  const payload = {
    user_id: userId,
    daily_practice_id: entry.dailyPracticeId,
    mode: entry.mode,
    practice_notes: entry.practiceNotes,
    observe_morning: entry.observeMorning,
    observe_midday: entry.observeMidday,
    observe_evening: entry.observeEvening,
    apply_morning: entry.applyMorning,
    apply_midday: entry.applyMidday,
    apply_evening: entry.applyEvening,
    journal_text: entry.journalText,
  };

  const { data, error } = await requireSupabase()
    .from('poa_entries')
    .upsert(payload, { onConflict: 'user_id,daily_practice_id' })
    .select('daily_practice_id, mode, practice_notes, observe_morning, observe_midday, observe_evening, apply_morning, apply_midday, apply_evening, journal_text, updated_at')
    .single();

  if (error) throw error;

  return mapPOAEntryRow(data as POAEntryRow);
}

export async function submitFeedback(message: string, context: Record<string, unknown> = {}): Promise<boolean> {
  const userId = await getSignedInUserId();
  if (!userId) return false;

  const { error } = await requireSupabase()
    .from('feedback')
    .insert({ user_id: userId, message, context });

  if (error) throw error;

  return true;
}

export async function resetTodayPracticeForLocalDemo(localDate = getLocalDate()): Promise<void> {
  const userId = await getSignedInUserId();
  if (!userId) return;

  await requireSupabase()
    .from('daily_practices')
    .delete()
    .eq('user_id', userId)
    .eq('local_date', localDate);
}

async function getSignedInUserId(): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return data.user.id;
}

function mapDailyPracticeRow(row: DailyPracticeRow): DailyPractice {
  return {
    id: row.id,
    localDate: row.local_date,
    source: row.source,
    status: row.status,
    selectedTool: row.selected_tool,
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    flybackNote: row.flyback_note ?? undefined,
    updatedAt: row.updated_at,
  };
}

function mapDrawHistoryRow(row: DrawHistoryRow): DrawHistoryEntry {
  return {
    id: row.id,
    localDate: row.local_date,
    source: row.source,
    selectedTool: row.selected_tool,
    drawnAt: row.drawn_at,
  };
}

function mapPOANoteRow(row: POANoteRow): POANote {
  return {
    id: row.id,
    dailyPracticeId: row.daily_practice_id,
    note: row.note,
    createdAt: row.created_at,
  };
}

function mapPOAEntryRow(row: POAEntryRow): POAEntry {
  return {
    dailyPracticeId: row.daily_practice_id,
    mode: row.mode,
    practiceNotes: row.practice_notes ?? '',
    observeMorning: row.observe_morning ?? '',
    observeMidday: row.observe_midday ?? '',
    observeEvening: row.observe_evening ?? '',
    applyMorning: row.apply_morning ?? '',
    applyMidday: row.apply_midday ?? '',
    applyEvening: row.apply_evening ?? '',
    journalText: row.journal_text ?? '',
    updatedAt: row.updated_at,
  };
}
