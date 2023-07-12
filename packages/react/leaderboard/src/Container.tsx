import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'
import { QueryClientProvider } from '@propeldata/ui-kit-graphql'

import { Leaderboard, LeaderboardProps } from './Leaderboard'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: LeaderboardProps) {
  const { styles } = props

  return (
    <QueryClientProvider>
      <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
        <Leaderboard {...props} />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
