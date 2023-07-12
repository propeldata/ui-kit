import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'
import { QueryClientProvider } from '@propeldata/ui-kit-graphql'

import { TimeSeries, TimeSeriesProps } from './TimeSeries'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: TimeSeriesProps) {
  const { error, styles } = props

  const errorProps = {
    error,
    styles
  }

  return (
    <QueryClientProvider>
      <ErrorBoundary fallback={<ErrorFallback {...errorProps} />}>
        <TimeSeries {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
