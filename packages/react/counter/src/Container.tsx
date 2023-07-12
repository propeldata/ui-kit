import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'
import { QueryClientProvider } from '@propeldata/ui-kit-graphql'

import { Counter, CounterProps } from './Counter'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: CounterProps) {
  const { styles } = props

  return (
    <QueryClientProvider>
      <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
        <Counter {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
