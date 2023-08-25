/**
 * Get the local time zone, falling back to "UTC" if unavailable.
 */
export function getTimeZone(): string {
  let timeZone = 'UTC'
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    // Do nothing.
  }
  return timeZone
}
