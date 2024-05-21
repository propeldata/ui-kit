import { getDateTimeFormatPattern } from './localeDateTime'

describe('DateTime Formatting', () => {
  describe('getDateTimeFormatPattern', () => {
    const originalDateTimeFormat = Intl.DateTimeFormat
    const mockedLocale = 'en-US'

    beforeEach(() => {
      const mockFormatToParts = jest.fn().mockReturnValue([
        { type: 'year', value: '2022' },
        { type: 'literal', value: ', ' },
        { type: 'month', value: '01' },
        { type: 'literal', value: ' ' },
        { type: 'day', value: '01' },
        { type: 'literal', value: ' ' },
        { type: 'hour', value: '13' },
        { type: 'literal', value: ':' },
        { type: 'minute', value: '00' },
        { type: 'literal', value: ':' },
        { type: 'second', value: '00' },
        { type: 'literal', value: ' ' },
        { type: 'dayPeriod', value: 'PM' }
      ])

      Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        resolvedOptions: () => ({ locale: mockedLocale, hour12: true }),
        formatToParts: mockFormatToParts
      })) as unknown as typeof Intl.DateTimeFormat
    })

    afterEach(() => {
      Intl.DateTimeFormat = originalDateTimeFormat // Restore original implementation after each test
    })

    it('should return a date-time pattern string based on locale and options', () => {
      const pattern = getDateTimeFormatPattern({
        locale: 'en-US',
        options: {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }
      })

      expect(pattern).toBe('yyyy, MMM dd hh:mm:ss a')
    })

    it('should handle 12-hour time correctly when 12-hour is true', () => {
      const pattern = getDateTimeFormatPattern({ locale: 'en-US', options: { hour: 'numeric' } })

      expect(pattern).toBe('yyyy, MM dd hh:mm:ss a')
    })

    it('should handle 2-digit month pattern', () => {
      const pattern = getDateTimeFormatPattern({ options: { month: '2-digit' } })

      expect(pattern).toBe('yyyy, MM dd hh:mm:ss a')
    })

    it('replaces non-breaking spaces with regular spaces', () => {
      Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
        formatToParts: () => [{ type: 'literal', value: String.fromCharCode(8239) }],
        resolvedOptions: () => ({ hour12: true })
      })) as unknown as typeof Intl.DateTimeFormat

      const pattern = getDateTimeFormatPattern({})
      expect(pattern).toBe(' ')
    })

    it('should return appropriate patterns when using complex options', () => {
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: '2-digit', hour12: true }

      const pattern = getDateTimeFormatPattern({ locale: 'en-US', options })
      expect(pattern).toContain('MMM')
      expect(pattern).toContain('dd')
      expect(pattern).toContain('hh')
      expect(pattern).toContain('mm')
      expect(pattern).toContain('ss')
      expect(pattern).toContain('a')
    })

    it('falls back to default parts when error occurs in formatting', () => {
      Intl.DateTimeFormat = jest.fn().mockImplementation(() => {
        throw new Error('Error formatting date')
      }) as unknown as typeof Intl.DateTimeFormat

      expect(() => getDateTimeFormatPattern({})).toThrow('Error formatting date')
    })
  })
})
