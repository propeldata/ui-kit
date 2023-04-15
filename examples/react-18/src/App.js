import React from 'react'

import {
  TimeSeriesStaticTest,
  TimeSeriesConnectedTest,
  LeaderboardStaticTest,
  LeaderboardConnectedTest,
  CounterStaticTest,
  CounterConnectedTest
} from 'components'

export default function App() {
  return (
    <main>
      <h1 className="m-3 text-3xl">React 18 Testing App</h1>
      <hr />
      <div className="grid grid-cols-2 gap-2">
        <TimeSeriesStaticTest />
        <TimeSeriesConnectedTest />
        <LeaderboardStaticTest />
        <LeaderboardConnectedTest />
        <CounterStaticTest />
        <CounterConnectedTest />
      </div>
    </main>
  )
}
