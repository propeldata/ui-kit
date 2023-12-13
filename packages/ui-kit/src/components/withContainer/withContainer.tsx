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
    const { errorFallbackProps, ...componentProps } = props as any

    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ErrorFallback {...errorFallbackProps} />}>
          {componentProps?.card ? (
            <Card style={componentProps?.style} className={componentProps?.className}>
              <WrappedComponent ref={ref} {...componentProps} />
            </Card>
          ) : (
            <WrappedComponent ref={ref} {...componentProps} />
          )}
        </ErrorBoundary>
      </QueryClientProvider>
    )
  })

  WithContainer.displayName = `WithContainer(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithContainer
}
