import React from 'react'
import { QueryClient, QueryClientProvider as ReactQueryProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
}
