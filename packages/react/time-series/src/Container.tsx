import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'

import { TimeSeries, TimeSeriesProps } from './TimeSeries'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: TimeSeriesProps) {
  const { error, styles } = props

  return (
    <ErrorBoundary fallback={<ErrorFallback error={error} styles={styles} />}>
      <TimeSeries {...props} />
    </ErrorBoundary>
  )
}
