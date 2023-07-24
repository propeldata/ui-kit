import React from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { QueryClient, QueryClientProvider } from '../../helpers'

import { Counter, CounterProps } from './Counter'
import { ErrorFallback } from '../ErrorFallback'

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
