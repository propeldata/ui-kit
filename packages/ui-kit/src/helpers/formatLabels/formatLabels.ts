export type TimeSeriesLabels = string[]
export type LeaderboardLabels = string[][]

export interface FormatLabelsOptions<T extends TimeSeriesLabels | LeaderboardLabels> {
  labels?: T
  formatter?: (labels: T) => T
}

export function formatLabels<T extends TimeSeriesLabels | LeaderboardLabels>(
  options: FormatLabelsOptions<T>
): T | undefined {
  const { labels, formatter } = options

  if (formatter && typeof formatter !== 'function') {
    throw new Error('Formatter must be a function')
  }

  return formatter ? formatter(labels || ([] as unknown as T)) : labels
}
