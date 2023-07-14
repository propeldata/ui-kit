import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'
import { QueryClient, QueryClientProvider } from '@propeldata/ui-kit-graphql'

import { Leaderboard, LeaderboardProps } from './Leaderboard'
import { ErrorFallback } from './ErrorFallback'

const queryClient = new QueryClient()

export function Container(props: LeaderboardProps) {
  const { styles } = props

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
        <Leaderboard {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
