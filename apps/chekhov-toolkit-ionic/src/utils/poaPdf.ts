import { jsPDF } from 'jspdf';
import { APP_NAME, CHART_ATTRIBUTION } from '@/constants/attribution';
import type { DailyPractice, POAEntry, POANote } from '@/types/practice';

/**
 * L6 (F2) — PWA PDF share for a Practice-of-the-day (POA).
 *
 * Pure builders (text, sections, filename, mailto) are split from the
 * jsPDF render and the share/download orchestration so the share path can be
 * unit tested with a mocked navigator and a stubbed Blob, without invoking a
 * real PDF render or touching the DOM.
 *
 * Attribution is sourced from the centralized constants so Lisa can refine the
 * NMCA / Lisa Dalton credit in one place after weekend feedback.
 */

export interface PoaShareInput {
  practice: DailyPractice;
  poa: POAEntry | null;
  notes?: POANote[];
  /**
   * Student name for classroom hand-ins: profile display name, else auth
   * metadata full name, else omitted (a blank "Name: ____" line is printed).
   * Never the raw email address; class/show is intentionally excluded.
   */
  studentName?: string | null;
}

/** "Name: <student>" line; blank fill-in line when no name is known. */
export function buildNameLine(studentName?: string | null): string {
  const trimmed = studentName?.trim();
  return trimmed ? `Name: ${trimmed}` : 'Name: __________________';
}

export interface PoaSection {
  heading: string;
  body: string;
}

export type PoaShareResult = 'shared' | 'downloaded' | 'mailto' | 'cancelled' | 'failed';

const ATTRIBUTION_FOOTER = `${CHART_ATTRIBUTION} — exported from ${APP_NAME}.`;

/** Human label for the chosen tool, e.g. "Atmosphere · Radiating". */
export function describeTool(practice: DailyPractice): string {
  const tool = practice.selectedTool;
  const parts = [tool.categoryName, tool.parentToolName];
  if (tool.childToolName) parts.push(tool.childToolName);
  return parts.filter(Boolean).join(' · ');
}

/**
 * Ordered POA sections for BOTH structured and free-journal modes. Empty
 * fields are dropped so the export stays clean. Falls back to a neutral
 * placeholder when nothing has been written yet.
 */
export function buildPoaSections(input: PoaShareInput): PoaSection[] {
  const { practice, poa, notes = [] } = input;
  const sections: PoaSection[] = [];

  sections.push({ heading: 'Tool', body: describeTool(practice) });

  if (practice.selectedTool.components?.length) {
    sections.push({
      heading: 'Components',
      body: practice.selectedTool.components.map((c) => `${c.label}: ${c.value}`).join('\n'),
    });
  }

  if (poa) {
    if (poa.mode === 'journal') {
      if (poa.journalText.trim()) {
        sections.push({ heading: 'Journal', body: poa.journalText.trim() });
      }
    } else {
      if (poa.practiceNotes.trim()) {
        sections.push({ heading: 'Practice', body: poa.practiceNotes.trim() });
      }

      const observe = compactLines([
        ['Morning', poa.observeMorning],
        ['Midday', poa.observeMidday],
        ['Evening', poa.observeEvening],
      ]);
      if (observe) sections.push({ heading: 'Observe', body: observe });

      const apply = compactLines([
        ['Morning', poa.applyMorning],
        ['Midday', poa.applyMidday],
        ['Evening', poa.applyEvening],
      ]);
      if (apply) sections.push({ heading: 'Apply', body: apply });
    }
  }

  if (notes.length) {
    sections.push({
      heading: 'Notes',
      body: notes.map((n) => `• ${n.note.trim()}`).join('\n'),
    });
  }

  // Never produce an empty body — keep the export honest but non-blank.
  if (sections.length === 1) {
    sections.push({ heading: 'POA', body: 'No POA notes recorded yet.' });
  }

  return sections;
}

function compactLines(rows: Array<[string, string]>): string {
  return rows
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join('\n');
}

/** Plain-text rendering of the POA — reused for the mailto body. */
export function buildPoaText(input: PoaShareInput): string {
  const title = `${APP_NAME} — Practice of the Day`;
  const nameLine = buildNameLine(input.studentName);
  const dateLine = `Date: ${input.practice.localDate}`;
  const sections = buildPoaSections(input)
    .map((s) => `${s.heading}\n${s.body}`)
    .join('\n\n');
  return `${title}\n${nameLine}\n${dateLine}\n\n${sections}\n\n${ATTRIBUTION_FOOTER}\n`;
}

/** Safe, dated filename, e.g. "chekhov-poa-2026-06-25.pdf". */
export function buildPoaFilename(practice: DailyPractice): string {
  const date = (practice.localDate || 'today').replace(/[^0-9A-Za-z-]/g, '-');
  return `chekhov-poa-${date}.pdf`;
}

/** mailto: href carrying a plain-text POA summary as a no-dead-end fallback. */
export function buildMailtoHref(input: PoaShareInput): string {
  const subject = `${APP_NAME} — POA ${input.practice.localDate}`;
  const body = buildPoaText(input);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Render the POA to a PDF Blob (real jsPDF). */
export function buildPoaPdfBlob(input: PoaShareInput): Blob {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  const footerY = pageHeight - 32;
  let y = margin;

  const newPageIfNeeded = (lineHeight: number) => {
    if (y + lineHeight > footerY - 24) {
      drawFooter(doc, pageWidth, footerY);
      doc.addPage();
      y = margin;
    }
  };

  const writeBlock = (text: string, size: number, bold: boolean, gap: number) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    const lineHeight = size * 1.35;
    for (const line of lines) {
      newPageIfNeeded(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += gap;
  };

  writeBlock(`${APP_NAME}`, 18, true, 2);
  writeBlock('Practice of the Day', 13, false, 2);
  writeBlock(buildNameLine(input.studentName), 11, false, 2);
  writeBlock(`Date: ${input.practice.localDate}`, 11, false, 10);

  for (const section of buildPoaSections(input)) {
    writeBlock(section.heading, 12, true, 2);
    writeBlock(section.body, 11, false, 10);
  }

  drawFooter(doc, pageWidth, footerY);

  return doc.output('blob');
}

function drawFooter(doc: jsPDF, pageWidth: number, footerY: number): void {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const lines = doc.splitTextToSize(ATTRIBUTION_FOOTER, pageWidth - 96) as string[];
  let fy = footerY;
  for (const line of lines) {
    doc.text(line, pageWidth / 2, fy, { align: 'center' });
    fy += 10;
  }
}

// --- Share orchestration (testable via injected deps) ---------------------

export interface ShareDeps {
  navigator?: {
    share?: (data: ShareData) => Promise<void>;
    canShare?: (data?: ShareData) => boolean;
  };
  createFile?: (blob: Blob, filename: string) => File;
  download?: (blob: Blob, filename: string) => void;
  openHref?: (href: string) => void;
}

function defaultDeps(): Required<ShareDeps> {
  return {
    navigator: typeof navigator !== 'undefined' ? navigator : {},
    createFile: (blob, filename) => new File([blob], filename, { type: 'application/pdf' }),
    download: (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke on the next tick so the click has a chance to start the download.
      setTimeout(() => URL.revokeObjectURL(url), 0);
    },
    openHref: (href) => {
      window.location.href = href;
    },
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException ? error.name === 'AbortError' : false;
}

/**
 * Share a prepared PDF Blob, with graceful fallbacks so the user is never
 * dead-ended:
 *   1. Web Share API with files (mobile Safari/Chrome/Android) → 'shared'
 *   2. clean file download (desktop, unsupported file-share) → 'downloaded'
 *   3. mailto: with a text summary if download is unavailable → 'mailto'
 * A user-cancelled share resolves to 'cancelled' (no surprise download).
 */
export async function shareOrDownloadPdf(
  blob: Blob,
  opts: { filename: string; title: string; text?: string; mailtoHref: string },
  deps: ShareDeps = {},
): Promise<PoaShareResult> {
  const d = { ...defaultDeps(), ...deps };
  const file = d.createFile(blob, opts.filename);
  const shareData: ShareData = { files: [file], title: opts.title, text: opts.text };

  const canShareFiles =
    typeof d.navigator.share === 'function' &&
    (typeof d.navigator.canShare !== 'function' || d.navigator.canShare(shareData));

  if (canShareFiles) {
    try {
      await d.navigator.share!(shareData);
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) return 'cancelled';
      // Fall through to download on any non-cancel share failure.
    }
  }

  try {
    d.download(blob, opts.filename);
    return 'downloaded';
  } catch {
    try {
      d.openHref(opts.mailtoHref);
      return 'mailto';
    } catch {
      return 'failed';
    }
  }
}

/** Convenience: build the PDF and share/download it in one call. */
export async function sharePoaPdf(input: PoaShareInput, deps: ShareDeps = {}): Promise<PoaShareResult> {
  const blob = buildPoaPdfBlob(input);
  return shareOrDownloadPdf(
    blob,
    {
      filename: buildPoaFilename(input.practice),
      title: `${APP_NAME} — POA ${input.practice.localDate}`,
      text: `Practice of the Day · ${describeTool(input.practice)}`,
      mailtoHref: buildMailtoHref(input),
    },
    deps,
  );
}
