import { describe, expect, test, vi } from 'vitest';
import {
  buildMailtoHref,
  buildNameLine,
  buildPoaFilename,
  buildPoaSections,
  buildPoaText,
  describeTool,
  shareOrDownloadPdf,
  type PoaShareInput,
} from '@/utils/poaPdf';
import { resolveStudentName } from '@/stores/authStore';
import type { DailyPractice, POAEntry, POANote } from '@/types/practice';

function makePractice(overrides: Partial<DailyPractice> = {}): DailyPractice {
  return {
    id: 'dp-1',
    localDate: '2026-06-25',
    source: 'random',
    status: 'started',
    selectedTool: {
      categoryId: 'atmosphere',
      categoryName: 'Atmosphere',
      parentToolName: 'Radiating',
      childToolName: 'Outward',
    },
    updatedAt: '2026-06-25T10:00:00.000Z',
    ...overrides,
  };
}

function makeStructuredPOA(overrides: Partial<POAEntry> = {}): POAEntry {
  return {
    dailyPracticeId: 'dp-1',
    mode: 'structured',
    practiceNotes: 'Explore expanding gesture.',
    observeMorning: 'Noticed it on the commute.',
    observeMidday: '',
    observeEvening: 'Rehearsal scene 2.',
    applyMorning: '',
    applyMidday: 'Used while writing.',
    applyEvening: '',
    journalText: '',
    updatedAt: '2026-06-25T11:00:00.000Z',
    ...overrides,
  };
}

describe('poaPdf pure builders', () => {
  test('describeTool joins category, parent and child tool', () => {
    expect(describeTool(makePractice())).toBe('Atmosphere · Radiating · Outward');
  });

  test('buildPoaFilename is safe and dated', () => {
    expect(buildPoaFilename(makePractice())).toBe('chekhov-poa-2026-06-25.pdf');
    expect(buildPoaFilename(makePractice({ localDate: '2026/06/25' }))).toBe('chekhov-poa-2026-06-25.pdf');
  });

  test('structured sections drop empty fields and keep written ones', () => {
    const input: PoaShareInput = { practice: makePractice(), poa: makeStructuredPOA() };
    const headings = buildPoaSections(input).map((s) => s.heading);
    expect(headings).toEqual(['Tool', 'Practice', 'Observe', 'Apply']);

    const observe = buildPoaSections(input).find((s) => s.heading === 'Observe')!;
    expect(observe.body).toContain('Morning: Noticed it on the commute.');
    expect(observe.body).toContain('Evening: Rehearsal scene 2.');
    expect(observe.body).not.toContain('Midday');
  });

  test('free journal mode renders the journal text', () => {
    const poa = makeStructuredPOA({ mode: 'journal', journalText: 'Free-form reflection.' });
    const sections = buildPoaSections({ practice: makePractice(), poa });
    const journal = sections.find((s) => s.heading === 'Journal');
    expect(journal?.body).toBe('Free-form reflection.');
    // Structured headings must not appear in journal mode.
    expect(sections.map((s) => s.heading)).not.toContain('Observe');
  });

  test('post-lock notes are appended', () => {
    const notes: POANote[] = [
      { id: 'n1', dailyPracticeId: 'dp-1', note: 'Later thought.', createdAt: '2026-06-25T20:00:00.000Z' },
    ];
    const sections = buildPoaSections({ practice: makePractice(), poa: makeStructuredPOA(), notes });
    expect(sections.find((s) => s.heading === 'Notes')?.body).toContain('• Later thought.');
  });

  test('empty POA never produces a blank export', () => {
    const sections = buildPoaSections({ practice: makePractice(), poa: null });
    expect(sections.map((s) => s.heading)).toEqual(['Tool', 'POA']);
    expect(sections[1].body).toMatch(/No POA notes recorded yet/);
  });

  test('buildPoaText and mailto href carry NMCA / Lisa Dalton attribution', () => {
    const input: PoaShareInput = { practice: makePractice(), poa: makeStructuredPOA() };
    const text = buildPoaText(input);
    expect(text).toContain('National Michael Chekhov Association');
    expect(text).toContain('Lisa Dalton');

    const href = buildMailtoHref(input);
    expect(href.startsWith('mailto:?subject=')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Lisa Dalton');
  });
});

describe('student name on exports (homework hand-in)', () => {
  test('buildNameLine prints the student name when present', () => {
    expect(buildNameLine('Ada Lovelace')).toBe('Name: Ada Lovelace');
    expect(buildNameLine('  Ada  ')).toBe('Name: Ada');
  });

  test('buildNameLine falls back to a blank fill-in line', () => {
    expect(buildNameLine(null)).toBe('Name: __________________');
    expect(buildNameLine(undefined)).toBe('Name: __________________');
    expect(buildNameLine('   ')).toBe('Name: __________________');
  });

  test('buildPoaText carries the name line above the date', () => {
    const input: PoaShareInput = { practice: makePractice(), poa: makeStructuredPOA(), studentName: 'Ada Lovelace' };
    const text = buildPoaText(input);
    const nameIndex = text.indexOf('Name: Ada Lovelace');
    const dateIndex = text.indexOf('Date: 2026-06-25');
    expect(nameIndex).toBeGreaterThan(-1);
    expect(dateIndex).toBeGreaterThan(nameIndex);
  });

  test('missing name exports the blank line, never an email address', () => {
    const text = buildPoaText({ practice: makePractice(), poa: makeStructuredPOA() });
    expect(text).toContain('Name: __________________');
    expect(text).not.toContain('@');
  });

  test('resolveStudentName prefers real display name, then full name, never email-derived display name', () => {
    expect(
      resolveStudentName({ id: 'u1', email: 'ada@example.com', displayName: 'Ada L.', fullName: 'Ada Lovelace' }),
    ).toBe('Ada L.');
    expect(
      resolveStudentName({ id: 'u1', email: 'ada@example.com', displayName: 'ada', fullName: 'Ada Lovelace' }),
    ).toBe('Ada Lovelace');
    expect(
      resolveStudentName({ id: 'u1', email: 'ada@example.com', displayName: '  ', fullName: 'Ada Lovelace' }),
    ).toBe('Ada Lovelace');
    expect(resolveStudentName({ id: 'u1', email: 'ada@example.com', displayName: 'ada' })).toBeNull();
    expect(resolveStudentName({ id: 'u1', email: 'ada@example.com' })).toBeNull();
    expect(resolveStudentName(null)).toBeNull();
  });
});

describe('historical POA export payload', () => {
  test('a saved/completed past day exports with its own date, content, and notes', () => {
    const practice = makePractice({
      id: 'dp-past',
      localDate: '2026-06-20',
      status: 'completed',
      selectedTool: {
        categoryId: 'psychological-gesture',
        categoryName: 'Psychological Gesture',
        parentToolName: 'Inspiration',
        childToolName: null,
      },
    });
    const poa = makeStructuredPOA({ dailyPracticeId: 'dp-past', practiceNotes: 'Completed day notes.' });
    const notes: POANote[] = [
      { id: 'n-past', dailyPracticeId: 'dp-past', note: 'Reflection after completion.', createdAt: '2026-06-20T21:00:00.000Z' },
    ];

    const input: PoaShareInput = { practice, poa, notes, studentName: 'Ada Lovelace' };

    expect(buildPoaFilename(practice)).toBe('chekhov-poa-2026-06-20.pdf');

    const text = buildPoaText(input);
    expect(text).toContain('Date: 2026-06-20');
    expect(text).toContain('Name: Ada Lovelace');
    expect(text).toContain('Psychological Gesture · Inspiration');
    expect(text).toContain('Completed day notes.');
    expect(text).toContain('Reflection after completion.');
    expect(text).toContain('Lisa Dalton');
    // No class/show fields exist on the export payload.
    expect(text).not.toMatch(/Class|Show:/);
  });
});

describe('shareOrDownloadPdf orchestration', () => {
  const blob = new Blob(['%PDF-fake'], { type: 'application/pdf' });
  const opts = {
    filename: 'chekhov-poa-2026-06-25.pdf',
    title: 'POA',
    text: 'Practice of the Day',
    mailtoHref: 'mailto:?subject=POA',
  };

  test('uses Web Share API with files when supported', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);
    const download = vi.fn();

    const result = await shareOrDownloadPdf(blob, opts, {
      navigator: { share, canShare },
      download,
    });

    expect(result).toBe('shared');
    expect(share).toHaveBeenCalledTimes(1);
    const shareArg = share.mock.calls[0][0];
    expect(shareArg.files[0]).toBeInstanceOf(File);
    expect(shareArg.files[0].name).toBe(opts.filename);
    expect(download).not.toHaveBeenCalled();
  });

  test('falls back to file download when share is unavailable', async () => {
    const download = vi.fn();
    const openHref = vi.fn();

    const result = await shareOrDownloadPdf(blob, opts, {
      navigator: {}, // no share()
      download,
      openHref,
    });

    expect(result).toBe('downloaded');
    expect(download).toHaveBeenCalledWith(blob, opts.filename);
    expect(openHref).not.toHaveBeenCalled();
  });

  test('falls back to download when canShare rejects files', async () => {
    const share = vi.fn();
    const canShare = vi.fn().mockReturnValue(false);
    const download = vi.fn();

    const result = await shareOrDownloadPdf(blob, opts, {
      navigator: { share, canShare },
      download,
    });

    expect(result).toBe('downloaded');
    expect(share).not.toHaveBeenCalled();
    expect(download).toHaveBeenCalledTimes(1);
  });

  test('a cancelled share does not trigger a surprise download', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'));
    const download = vi.fn();

    const result = await shareOrDownloadPdf(blob, opts, {
      navigator: { share, canShare: () => true },
      download,
    });

    expect(result).toBe('cancelled');
    expect(download).not.toHaveBeenCalled();
  });

  test('non-cancel share failure falls through to download', async () => {
    const share = vi.fn().mockRejectedValue(new Error('share boom'));
    const download = vi.fn();

    const result = await shareOrDownloadPdf(blob, opts, {
      navigator: { share, canShare: () => true },
      download,
    });

    expect(result).toBe('downloaded');
    expect(download).toHaveBeenCalledTimes(1);
  });

  test('mailto is the last-resort fallback when download throws', async () => {
    const openHref = vi.fn();
    const result = await shareOrDownloadPdf(blob, opts, {
      navigator: {},
      download: () => {
        throw new Error('no DOM');
      },
      openHref,
    });

    expect(result).toBe('mailto');
    expect(openHref).toHaveBeenCalledWith(opts.mailtoHref);
  });
});
