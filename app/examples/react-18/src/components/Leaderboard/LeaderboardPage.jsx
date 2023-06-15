import React from 'react'

import { LeaderboardConnectedTest, LeaderboardStaticTest } from '.'

export function LeaderboardPage() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <LeaderboardStaticTest />
      <LeaderboardConnectedTest />
    </div>
  )
}
