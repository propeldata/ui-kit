import React from 'react'
import { ErrorBoundary } from '@propeldata/ui-kit-components'

import { Leaderboard, LeaderboardProps } from './Leaderboard'
import { ErrorFallback } from './ErrorFallback'

export function Container(props: LeaderboardProps) {
  const { styles } = props

  return (
    <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
      <Leaderboard {...props} />
    </ErrorBoundary>
  )
}