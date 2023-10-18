export interface FormatLabelsOptions {
  labels?: string[]
  formatter?: (labels: string[]) => string[]
}

export function formatLabels(options: FormatLabelsOptions): string[] | undefined {
  const { labels, formatter } = options

  if (formatter && typeof formatter !== 'function') {
    throw new Error('`labelFormatter` prop must be a formatter function')
  }

  return formatter ? formatter(labels || []) : labels
}
