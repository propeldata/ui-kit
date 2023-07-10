import React from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { Counter, CounterProps } from './Counter'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: CounterProps) {
  const { styles } = props

  return (
    <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
      <Counter {...props} />
    </ErrorBoundary>
  )
}
