import React from 'react'
import { ErrorBoundary } from '../ErrorBoundary'

export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  ErrorFallback: React.ComponentType<P>
) => {
  return function Container(props: P) {
    return (
      <ErrorBoundary fallback={<ErrorFallback {...props} />}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}
