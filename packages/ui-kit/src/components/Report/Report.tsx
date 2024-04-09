import React from 'react'
import classNames from 'classnames'

import { ErrorFallback } from '../ErrorFallback'
import { withContainer } from '../withContainer'
import { Card } from '../Card'
import { useReportComponents } from '../../hooks'

import componentStyles from './Report.module.scss'
import { ChartProp } from './Report.types'
import { buildGridTemplateAreas } from './utils'
import { TimeSeries, TimeSeriesProps } from '../TimeSeries'
import { Leaderboard, LeaderboardProps } from '../Leaderboard'
import { Counter, CounterProps } from '../Counter'
import { Loader } from '../Loader'

interface Props {
  layout: string[][]
  charts: ChartProp[]
  clickable?: boolean
  onCardClick?: (chart: ChartProp) => void
  reportCardProps?: React.HTMLAttributes<HTMLDivElement>
  propelApiUrl?: string
}

const componentMap = {
  timeSeries: (args: TimeSeriesProps) => <TimeSeries {...args} />,
  leaderboard: (args: LeaderboardProps) => <Leaderboard {...args} style={{ height: '100%' }} />,
  counter: (args: CounterProps) => <Counter {...args} />,
  '': () => null
}

export const ReportComponent = React.forwardRef((props: Props) => {
  const { layout, charts, clickable = false, onCardClick, reportCardProps, propelApiUrl } = props

  const { charts: reportCharts, isLoading } = useReportComponents(charts, { propelApiUrl })

  const gridTemplateAreas = buildGridTemplateAreas(layout)

  return (
    <div
      className={componentStyles.container}
      style={{
        gridTemplateAreas,
        gridTemplateRows: layout.map(() => '1fr').join(' '),
        gridTemplateColumns: layout[0].map(() => '1fr').join(' ')
      }}
    >
      {reportCharts.map((chart, chartIdx) => (
        <Card
          key={`${chart.id}-${chartIdx}`}
          {...reportCardProps}
          className={classNames(
            componentStyles.card,
            clickable && componentStyles.clickable,
            reportCardProps?.className
          )}
          onClick={(e) => clickable && (onCardClick?.(chart) ?? reportCardProps?.onClick?.(e))}
          style={{ ...reportCardProps?.style, gridArea: `report-area-${chart.id}` }}
        >
          {!isLoading ? (
            chart.result != null && componentMap[chart.type]({ ...chart.result[chart.type] })
          ) : (
            <Loader className={componentStyles.loader} />
          )}
        </Card>
      ))}
    </div>
  )
})

ReportComponent.displayName = 'ReportComponent'

export const Report = withContainer(ReportComponent, ErrorFallback) as typeof ReportComponent
