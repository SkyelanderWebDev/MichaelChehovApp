// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import { getLocalDate, getPOA, getTodayPractice, savePOA, setPreview } from '@/stores/dailyPracticeStore'
import type { PracticeToolSelection } from '@/types/practice'

const SELECTION: PracticeToolSelection = {
  categoryId: 'four-brothers',
  categoryName: 'Four Brothers of Art',
  parentToolName: 'Ease',
  childToolName: 'Flow',
  scaleValue: null,
  unveiledValue: null,
}

describe('daily practice Supabase persistence seam', () => {
  test('formats local dates without UTC drift', () => {
    expect(getLocalDate(new Date(2026, 5, 10, 23, 30))).toBe('2026-06-10')
  })

  test('does not fall back to localStorage when Supabase/auth is unavailable', async () => {
    const localDate = '2026-06-10'

    expect(await getTodayPractice(localDate)).toBeNull()
    expect(await setPreview(SELECTION, 'self-selected', localDate)).toBeNull()
    expect(await getPOA('00000000-0000-0000-0000-000000000000')).toBeNull()
    expect(await savePOA({
      dailyPracticeId: '00000000-0000-0000-0000-000000000000',
      mode: 'journal',
      practiceNotes: '',
      observeMorning: '',
      observeMidday: '',
      observeEvening: '',
      applyMorning: '',
      applyMidday: '',
      applyEvening: '',
      journalText: 'Should not be saved without Supabase auth',
    })).toBeNull()
  })
})
