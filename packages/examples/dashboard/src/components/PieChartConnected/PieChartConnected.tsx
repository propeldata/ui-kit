import { PieChart, PieChartVariant, Button, Select, Option } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

type chartTypeOption = {
  value: PieChartVariant
  label: string
}

const chartTypeOptions: chartTypeOption[] = [
  { value: 'pie', label: 'Pie' },
  { value: 'doughnut', label: 'Doughnut' }
]

export const PieChartConnected = ({
  envs: { REACT_APP_METRIC_UNIQUE_NAME_1, REACT_APP_DIMENSION_1 = '' },
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
      <h2 className="text-2xl">PieChart Connected</h2>
      <div className="my-4">
        <PieChart
          card
          query={{
            dimension: {
              columnName: REACT_APP_DIMENSION_1
            },
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            rowLimit: 8,
            timeRange,
            refetchInterval,
            retry: false,
            filters: []
          }}
          variant={chartType.value}
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
