import React from 'react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Card } from '../Card'
import { ErrorBoundary } from '../ErrorBoundary'

const queryClient = new QueryClient()

export const withContainer = <P extends object, C extends object>(
  WrappedComponent: React.ComponentType<P>,
  ErrorFallback: React.ComponentType<C>
) => {
  const WithContainer = React.forwardRef<HTMLDivElement, P & C>((props, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { errorFallbackProps, card, cardProps, ...componentProps } = props as any
    const wrappedComponent = <WrappedComponent ref={ref} errorFallbackProps={errorFallbackProps} {...componentProps} />

    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ErrorFallback {...errorFallbackProps} />}>
          {card ? <Card {...cardProps}>{wrappedComponent}</Card> : wrappedComponent}
        </ErrorBoundary>
      </QueryClientProvider>
    )
  })

  WithContainer.displayName = `WithContainer(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithContainer
}
