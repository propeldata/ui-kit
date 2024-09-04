import { TimeSeries, TimeSeriesChartVariant, Button, Select, Option, Typography } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

type chartTypeOption = {
  value: TimeSeriesChartVariant
  label: string
}

const chartTypeOptions: chartTypeOption[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' }
]

export const TimeSeriesConnected = ({
  envs: { REACT_APP_METRIC_UNIQUE_NAME_1 },
  timeRange: timeRangeProp
}: ConnectedComponentProps) => {
  const [chartType, setChartType] = React.useState(chartTypeOptions[0])
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
      <Typography size={6}>TimeSeries Connected</Typography>
      <div className="my-4">
        <TimeSeries
          card
          query={{
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            timeRange,
            refetchInterval,
            retry: false
          }}
          variant={chartType.value}
        />
      </div>
      <div className="flex items-center gap-2 mt-1 justify-between">
        <div className="flex-1 flex gap-2">
          {chartType.value === 'line' && (
            <Button size="small" onClick={() => setPointStyle(pointStyle === 'cross' ? 'triangle' : 'cross')}>
              Switch point style
            </Button>
          )}
          <Button size="small" onClick={handleSwitchRefetchInterval}>
            Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
          </Button>
          <Button size="small" onClick={() => setTimeRange({ n: 0 })}>
            No data: {timeRange?.n === 0 ? 'On' : 'Off'}
          </Button>
        </div>
        <div className="flex-none">
          <Select
            size="small"
            onChange={(_, val) => setChartType(val as (typeof chartTypeOptions)[0])}
            value={chartType}
          >
            {chartTypeOptions.map((option) => (
              <Option key={option.value} value={option}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
