import React from 'react'
import { RelativeTimeRange, TimeSeries, TimeSeriesGranularity } from '@propeldata/react-time-series'

export function TimeSeriesConnectedTest() {
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')
  const [pointStyle, setPointStyle] = React.useState('cross')

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">TimeSeries Connected</h2>
      <TimeSeries
        query={{
          accessToken: '<PROPEL_ACCESS_TOKEN>',
          metric: 'queryCount',
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          },
          granularity: TimeSeriesGranularity.Day
        }}
        variant={chartType}
        styles={{
          bar: { backgroundColor: barsColor },
          canvas: { backgroundColor: '#f5f5f5' },
          point: { style: pointStyle }
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
          <option value="line">Line</option>
        </select>
        <button
          className="border-2 bg-white p-1 h-9"
          onClick={() => setPointStyle(pointStyle === 'cross' ? 'triangle' : 'cross')}
        >
          Switch point style
        </button>
      </div>
    </div>
  )
}
