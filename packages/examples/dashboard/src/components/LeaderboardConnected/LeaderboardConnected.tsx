import { Leaderboard, LeaderboardChartVariant } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

export const LeaderboardConnected = ({
  envs: {
    REACT_APP_METRIC_UNIQUE_NAME_1,
    REACT_APP_DIMENSION_1 = '',
    REACT_APP_DIMENSION_2 = '',
    REACT_APP_DIMENSION_3 = ''
  },
  timeRange: timeRangeProp
}: ConnectedComponentProps) => {
  const [barsColor, setBarsColor] = React.useState('#75BFFF')
  const [chartType, setChartType] = React.useState<LeaderboardChartVariant>('bar')
  const [refetchInterval, setRefetchInterval] = React.useState<number | undefined>(undefined)
  const [timeRange, setTimeRange] = React.useState(timeRangeProp)

  React.useEffect(() => {
    setTimeRange(timeRangeProp)
  }, [timeRangeProp])

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
            timeRange,
            refetchInterval,
            retry: false
          }}
          variant={chartType}
          // Custom styles
          className="custom-leaderboard"
          chartConfigProps={(config) => {
            // Custom bar color
            config.data.datasets[0].backgroundColor = barsColor
            return config
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        {chartType === 'bar' && (
          <input
            className="border-2 p-1 h-9"
            type="color"
            onChange={(event) => setBarsColor(event.target.value)}
            value={barsColor}
          />
        )}
        <select
          className="border-2 p-1 h-9 cursor-pointer"
          value={chartType}
          onChange={(event) => setChartType(event.target.value as LeaderboardChartVariant)}
        >
          <option value="bar">Bar</option>
          <option value="table">Table</option>
        </select>
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
        <button className="border-2 p-1 h-9" onClick={() => setTimeRange({ n: 0 })}>
          No data: {timeRange?.n ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}
