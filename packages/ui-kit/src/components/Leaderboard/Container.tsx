import React from 'react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { ErrorBoundary } from '../ErrorBoundary'
import { ErrorFallback } from '../ErrorFallback'
import { Leaderboard } from './Leaderboard'
import type { LeaderboardProps } from './Leaderboard.types'

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
