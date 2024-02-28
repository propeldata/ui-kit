export const DEFAULT_TIME_ZONE = 'UTC'

/**
 * Return timeZone if provided. Otherwise get the local time zone. Falling back to "UTC" if unavailable.
 */
export function getTimeZone(timeZone?: string): string {
  if (timeZone) {
    return timeZone
  }

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? DEFAULT_TIME_ZONE
  } catch (error) {
    return DEFAULT_TIME_ZONE
  }
}
