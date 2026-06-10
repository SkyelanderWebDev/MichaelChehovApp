import { describe, expect, test } from 'vitest'
import { APP_NAME, CHART_ATTRIBUTION } from '@/constants/attribution'

describe('Toolkit attribution constants', () => {
  test('uses the approved app name and NMCA/Lisa chart credit', () => {
    expect(APP_NAME).toBe('The Michael Chekhov Toolkit')
    expect(CHART_ATTRIBUTION).toContain('Chart of Inspired Action © 2004 National Michael Chekhov Association')
    expect(CHART_ATTRIBUTION).toContain('Lisa Dalton, NMCA President and Master Teacher')
  })
})
