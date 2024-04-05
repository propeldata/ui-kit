import { PieChart, PieChartVariant, RelativeTimeRange } from '@propeldata/ui-kit'
import React from 'react'
import { DashboardCommonProps } from '../../shared.types'

export const PieChartConnected = ({
  envs: { REACT_APP_METRIC_UNIQUE_NAME_1, REACT_APP_DIMENSION_1 = '' }
}: DashboardCommonProps) => {
  const [chartType, setChartType] = React.useState<PieChartVariant>('pie')
  const [refetchInterval, setRefetchInterval] = React.useState<number | undefined>(undefined)
  const [n, SetN] = React.useState<number>(90)

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
            dimension: {
              columnName: REACT_APP_DIMENSION_1
            },
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            rowLimit: 8,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n
            },
            refetchInterval,
            retry: false,
            filters: []
          }}
          variant={chartType}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <select
          className="border-2 p-1 h-9 cursor-pointer"
          value={chartType}
          onChange={(event) => setChartType(event.target.value as PieChartVariant)}
        >
          <option value="pie">Pie</option>
          <option value="doughnut">Doughnut</option>
        </select>
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
        <button className="border-2 p-1 h-9" onClick={() => SetN(n === 0 ? 30 : 0)}>
          No data: {n === 0 ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}
