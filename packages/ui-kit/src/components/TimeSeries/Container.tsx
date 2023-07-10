import React from 'react'
import { ErrorBoundary } from '../ErrorBoundary'

import { TimeSeries, TimeSeriesProps } from './TimeSeries'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: TimeSeriesProps) {
  const { error, styles } = props

  const errorProps = {
    error,
    styles
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback {...errorProps} />}>
      <TimeSeries {...props} />
    </ErrorBoundary>
  )
}
