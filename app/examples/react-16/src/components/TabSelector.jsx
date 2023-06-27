import React from 'react'

import { TimeSeriesPage } from './TimeSeries'
import { CounterPage } from './Counter'
import { LeaderboardPage } from './Leaderboard'

export function TabSelector() {
  const [currentTab, setCurrentTab] = React.useState('time-series')

  const tab = {
    'time-series': <TimeSeriesPage />,
    leaderboard: <LeaderboardPage />,
    counter: <CounterPage />
  }[currentTab]

  return (
    <div>
      <div className="flex">
        <div className="flex items-center gap-2">
          <button
            className={`border-2 w-28 p-1 h-9 ${currentTab === 'time-series' ? 'bg-slate-200' : ''}`}
            onClick={() => setCurrentTab('time-series')}
          >
            Time Series
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`border-2 w-28 p-1 h-9 ${currentTab === 'leaderboard' ? 'bg-slate-200' : ''}`}
            onClick={() => setCurrentTab('leaderboard')}
          >
            Leaderboard
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`border-2 w-28 p-1 h-9 ${currentTab === 'counter' ? 'bg-slate-200' : ''}`}
            onClick={() => setCurrentTab('counter')}
          >
            Counter
          </button>
        </div>
      </div>
      <div>{tab}</div>
    </div>
  )
}
