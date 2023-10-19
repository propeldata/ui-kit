import React from 'react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { ErrorBoundary } from '../ErrorBoundary'

export const queryClient = new QueryClient()

export const withContainer = <P extends object, C extends object>(
  WrappedComponent: React.ComponentType<P>,
  ErrorFallback: React.ComponentType<C>
) => {
  return function Container(componentProps: P, errorFallbackProps: C) {
    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ErrorFallback {...errorFallbackProps} />}>
          <WrappedComponent {...componentProps} />
        </ErrorBoundary>
      </QueryClientProvider>
    )
  }
}
