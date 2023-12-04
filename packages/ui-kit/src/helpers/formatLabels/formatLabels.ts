export type Labels = string[] | string[][]

export interface FormatLabelsOptions {
  labels?: Labels
  formatter?: (labels: Labels) => Labels
}

export function formatLabels(options: FormatLabelsOptions): Labels | undefined {
  const { labels, formatter } = options

  if (formatter && typeof formatter !== 'function') {
    throw new Error('`labelFormatter` prop must be a formatter function')
  }

  return formatter ? formatter(labels || []) : labels
}
