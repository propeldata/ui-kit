import React from 'react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { ErrorBoundary } from '../ErrorBoundary'
import { ErrorFallback } from '../ErrorFallback'
import { TimeSeries } from './TimeSeries'
import type { TimeSeriesProps } from './TimeSeries.types'

const queryClient = new QueryClient()

export function Container(props: TimeSeriesProps) {
  const { error, styles } = props

  const errorProps = {
    error,
    styles
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<ErrorFallback {...errorProps} />}>
        <TimeSeries {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
