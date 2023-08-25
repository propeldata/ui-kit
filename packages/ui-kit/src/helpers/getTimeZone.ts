const DEFAULT_TIME_ZONE = 'UTC'

/**
 * Get the local time zone, falling back to "UTC" if unavailable.
 */
export function getTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? DEFAULT_TIME_ZONE
  } catch (error) {
    return DEFAULT_TIME_ZONE
  }
}
