import React from 'react'
import { RelativeTimeRange, TimeSeries, TimeSeriesGranularity } from '@propeldata/ui-kit'

const { REACT_APP_METRIC_UNIQUE_NAME_1 } = process.env

export function TimeSeriesConnectedTest() {
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')
  const [pointStyle, setPointStyle] = React.useState('cross')
  const [refetchInterval, setRefetchInterval] = React.useState(undefined)

  const handleSwitchRefetchInterval = () => {
    setRefetchInterval(refetchInterval ? undefined : 1000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">TimeSeries Connected</h2>
      <div className="my-5">
        <TimeSeries
          card
          query={{
            accessToken: REACT_APP_PROPEL_ACCESS_TOKEN,
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            },
            granularity: TimeSeriesGranularity.Day,
            refetchInterval,
            retry: false
          }}
          variant={chartType}
          styles={{
            bar: { backgroundColor: barsColor },
            canvas: { backgroundColor: '#f5f5f5' },
            point: { style: pointStyle }
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
          <option value="line">Line</option>
        </select>
        <button
          className="border-2 p-1 h-9"
          onClick={() => setPointStyle(pointStyle === 'cross' ? 'triangle' : 'cross')}
        >
          Switch point style
        </button>
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
      </div>
    </div>
  )
}
