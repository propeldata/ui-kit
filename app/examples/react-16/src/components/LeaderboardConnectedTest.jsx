import React from 'react'
import { Leaderboard, RelativeTimeRange } from '@propeldata/react-leaderboard'

export function LeaderboardConnectedTest() {
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">Leaderboard Connected</h2>
      <Leaderboard
        query={{
          accessToken: '<PROPEL_ACCESS_TOKEN>',
          dimensions: [
            {
              columnName: 'METRIC_TYPE'
            },
            {
              columnName: 'ENVIRONMENT_ID'
            },
            {
              columnName: 'ACCOUNT_ID'
            }
          ],
          metric: 'queryCount',
          rowLimit: 8,
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          }
        }}
        variant={chartType}
        styles={{
          bar: { backgroundColor: barsColor },
          table: { height: '200px', backgroundColor: '#f5f5f5', header: { backgroundColor: '#f5f5f5' } },
          canvas: { backgroundColor: '#f5f5f5' }
        }}
      />
      <div className="flex items-center gap-2">
        <input
          className="border-2 bg-white p-1 h-9"
          type="color"
          onChange={(event) => setBarsColor(event.target.value)}
        />
        <select
          className="border-2 bg-white p-1 h-9 cursor-pointer"
          value={chartType}
          onChange={(event) => setChartType(event.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="table">Table</option>
        </select>
      </div>
    </div>
  )
}
