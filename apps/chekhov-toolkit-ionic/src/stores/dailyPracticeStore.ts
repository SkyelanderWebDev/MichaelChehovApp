import { requireSupabase, supabase } from '@/lib/supabaseClient';
import type { DailyPractice, POAEntry, PracticeSource, PracticeToolSelection } from '@/types/practice';

interface DailyPracticeRow {
  id: string;
  local_date: string;
  source: PracticeSource;
  status: 'preview' | 'started';
  selected_tool: PracticeToolSelection;
  started_at: string | null;
  updated_at: string;
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
    .select('id, local_date, source, status, selected_tool, started_at, updated_at')
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
  if (existing?.status === 'started') {
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
    .select('id, local_date, source, status, selected_tool, started_at, updated_at')
    .single();

  if (error) throw error;

  return mapDailyPracticeRow(data as DailyPracticeRow);
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
    .select('id, local_date, source, status, selected_tool, started_at, updated_at')
    .single();

  if (error) throw error;

  return mapDailyPracticeRow(data as DailyPracticeRow);
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
    updatedAt: row.updated_at,
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
