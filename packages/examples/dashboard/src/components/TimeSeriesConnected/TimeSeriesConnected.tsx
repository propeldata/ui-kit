import { TimeSeries, TimeSeriesChartVariant, TimeSeriesGranularity } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

export const TimeSeriesConnected = ({
  envs: { REACT_APP_METRIC_UNIQUE_NAME_1 },
  timeRange: timeRangeProp
}: ConnectedComponentProps) => {
  const [chartColor, setChartColor] = React.useState('#75BFFF')
  const [chartType, setChartType] = React.useState<TimeSeriesChartVariant>('bar')
  const [pointStyle, setPointStyle] = React.useState('cross')
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
      <h2 className="text-2xl">TimeSeries Connected</h2>
      <div className="my-5">
        <TimeSeries
          card
          query={{
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            timeRange,
            granularity: TimeSeriesGranularity.Day,
            refetchInterval,
            retry: false
          }}
          variant={chartType}
          // Should be removed when the `chartConfigProps` is fixed
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chartConfigProps={(config: any) => {
            // Custom bar color
            config.data.datasets[0].backgroundColor = chartColor

            // Custom point settings
            config.data.datasets[0].pointStyle = pointStyle
            config.data.datasets[0].borderColor = chartColor
            config.options.scales.y.beginAtZero = false
            config.options.scales.y.scale = 'logarithmic'
            return config
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input
          className="border-2 p-1 h-9"
          type="color"
          value={chartColor}
          onChange={(event) => setChartColor(event.target.value)}
        />
        <select
          className="border-2 p-1 h-9 cursor-pointer"
          onChange={(event) => setChartType(event.target.value as TimeSeriesChartVariant)}
          value={chartType}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
        {chartType === 'line' && (
          <button
            className="border-2 p-1 h-9"
            onClick={() => setPointStyle(pointStyle === 'cross' ? 'triangle' : 'cross')}
          >
            Switch point style
          </button>
        )}
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
        <button className="border-2 p-1 h-9" onClick={() => setTimeRange({ n: 0 })}>
          No data: {timeRange?.n === 0 ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}
