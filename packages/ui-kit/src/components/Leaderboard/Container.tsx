import React from 'react'
import { ErrorBoundary } from '../ErrorBoundary'
import { ErrorFallback } from './ErrorFallback'
import { Leaderboard, LeaderboardProps } from './Leaderboard'

export function Container(props: LeaderboardProps) {
  const { styles } = props

  return (
    <ErrorBoundary fallback={<ErrorFallback styles={styles} />}>
      <Leaderboard {...props} />
    </ErrorBoundary>
  )
}
