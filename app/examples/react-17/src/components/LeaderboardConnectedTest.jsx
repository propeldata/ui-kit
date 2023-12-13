import React from 'react'
import { Leaderboard, RelativeTimeRange } from '@propeldata/ui-kit'

const { REACT_APP_METRIC_UNIQUE_NAME_1, REACT_APP_DIMENSION_1, REACT_APP_DIMENSION_2, REACT_APP_DIMENSION_3 } =
  process.env

export function LeaderboardConnectedTest() {
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')

  const [refetchInterval, setRefetchInterval] = React.useState(undefined)

  const handleSwitchRefetchInterval = () => {
    setRefetchInterval(refetchInterval ? undefined : 1000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">Leaderboard Connected</h2>
      <div className="my-5">
        <Leaderboard
          card
          query={{
            dimensions: [
              {
                columnName: REACT_APP_DIMENSION_1
              },
              {
                columnName: REACT_APP_DIMENSION_2
              },
              {
                columnName: REACT_APP_DIMENSION_3
              }
            ],
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            rowLimit: 8,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            },
            refetchInterval,
            retry: false
          }}
          variant={chartType}
          styles={{
            bar: { backgroundColor: barsColor },
            table: { height: '200px', backgroundColor: '#f5f5f5', header: { backgroundColor: '#f5f5f5' } },
            canvas: { backgroundColor: '#f5f5f5' }
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input className="border-2 p-1 h-9" type="color" onChange={(event) => setBarsColor(event.target.value)} />
        <select
          className="border-2 p-1 h-9 cursor-pointer"
          value={chartType}
          onChange={(event) => setChartType(event.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="table">Table</option>
        </select>
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
      </div>
    </div>
  )
}
