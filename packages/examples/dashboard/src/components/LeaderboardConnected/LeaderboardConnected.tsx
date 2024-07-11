import { Leaderboard, LeaderboardChartVariant, Button, Select, Option } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

type chartTypeOption = {
  value: LeaderboardChartVariant
  label: string
}

const chartTypeOptions: chartTypeOption[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'table', label: 'Table' }
]

export const LeaderboardConnected = ({
  envs: {
    REACT_APP_METRIC_UNIQUE_NAME_1,
    REACT_APP_DIMENSION_1 = '',
    REACT_APP_DIMENSION_2 = '',
    REACT_APP_DIMENSION_3 = ''
  },
  timeRange: timeRangeProp
}: ConnectedComponentProps) => {
  const [chartType, setChartType] = React.useState(chartTypeOptions[0])
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
      <div className="my-4">
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
          variant={chartType.value}
          // Custom styles
          className="custom-leaderboard"
        />
      </div>
      <div className="flex items-center gap-2 mt-1 justify-between">
        <div className="flex-1 flex gap-2">
          <Button size="small" onClick={handleSwitchRefetchInterval}>
            Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
          </Button>
          <Button size="small" onClick={() => setTimeRange({ n: 0 })}>
            No data: {timeRange?.n ? 'On' : 'Off'}
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
