import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'
import { QueryClient, QueryClientProvider } from '@propeldata/ui-kit-graphql'

import { Counter, CounterProps } from './Counter'
import { ErrorFallback } from './ErrorFallback'

const queryClient = new QueryClient()

export function Container(props: CounterProps) {
  const { styles } = props

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
        <Counter {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
