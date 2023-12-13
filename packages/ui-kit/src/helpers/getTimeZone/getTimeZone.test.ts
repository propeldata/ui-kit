import { getTimeZone, DEFAULT_TIME_ZONE } from './getTimeZone'

describe('getTimeZone', () => {
  const originalDateTimeFormat = Intl.DateTimeFormat

  beforeEach(() => {
    const mockDateTimeFormat = {
      resolvedOptions: () => ({ timeZone: 'America/New_York' })
    }

    // Mock the instance method
    Intl.DateTimeFormat = jest
      .fn()
      .mockImplementation(() => mockDateTimeFormat) as unknown as typeof Intl.DateTimeFormat

    // Mock the static method
    Intl.DateTimeFormat.supportedLocalesOf = jest.fn().mockImplementation(() => ['en-US'])
  })

  afterEach(() => {
    Intl.DateTimeFormat = originalDateTimeFormat // Restore original implementation after each test
  })

  it('returns the local time zone if available', () => {
    expect(getTimeZone()).toBe('America/New_York')
  })

  it('falls back to UTC if an error occurs', () => {
    Intl.DateTimeFormat = jest.fn().mockImplementation(() => {
      throw new Error('Error fetching time zone')
    }) as unknown as typeof Intl.DateTimeFormat

    expect(getTimeZone()).toBe(DEFAULT_TIME_ZONE)
  })
})
