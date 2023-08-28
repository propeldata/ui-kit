import React from 'react'
import { QueryClient, QueryClientProvider } from '../graphql'

const queryClient = new QueryClient()

export const withDataProvider = <С extends object>(WrappedComponent: React.ComponentType<С>) =>
  function DataProvider(componentProps: С) {
    return (
      <QueryClientProvider client={queryClient}>
        <WrappedComponent {...componentProps} />
      </QueryClientProvider>
    )
  }
