import React from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { TimeSeries, TimeSeriesProps } from './TimeSeries'
import { ErrorFallback } from '../ErrorFallback'

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
