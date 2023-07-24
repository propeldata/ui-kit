import React from 'react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { ErrorBoundary } from '../ErrorBoundary'
import { ErrorFallback } from '../ErrorFallback'
import { Counter } from './Counter'
import type { CounterProps } from './Counter.types'

const queryClient = new QueryClient()

export function Container(props: CounterProps) {
  const { styles } = props

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<ErrorFallback error={null} styles={styles} />}>
        <Counter {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
