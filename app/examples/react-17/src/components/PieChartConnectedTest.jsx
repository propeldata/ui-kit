import React from 'react'
import { PieChart, RelativeTimeRange } from '@propeldata/ui-kit'

const { REACT_APP_METRIC_UNIQUE_NAME_1, REACT_APP_DIMENSION_1 } = process.env

export function PieChartConnectedTest() {
  const [chartType, setChartType] = React.useState('pie')

  const [refetchInterval, setRefetchInterval] = React.useState(undefined)

  const handleSwitchRefetchInterval = () => {
    setRefetchInterval(refetchInterval ? undefined : 1000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">PieChart Connected</h2>
      <div className="my-5">
        <PieChart
          card
          query={{
            dimensions: [
              {
                columnName: REACT_APP_DIMENSION_1
              }
            ],
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            rowLimit: 8,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 90
            },
            refetchInterval,
            retry: false,
            filters: []
          }}
          variant={chartType}
          styles={{
            canvas: { backgroundColor: '#f5f5f5' }
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <select
          className="border-2 p-1 h-9 cursor-pointer"
          value={chartType}
          onChange={(event) => setChartType(event.target.value)}
        >
          <option value="pie">Pie</option>
          <option value="doughnut">Doughnut</option>
        </select>
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
      </div>
    </div>
  )
}
