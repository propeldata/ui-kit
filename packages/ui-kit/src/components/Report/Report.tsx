import React from 'react'
import classNames from 'classnames'

import { ErrorFallback } from '../ErrorFallback'
import { withContainer } from '../withContainer'
import { Card } from '../Card'
import { useReportComponents } from '../../hooks'
import { PieChartProps, PieChart } from '../PieChart'

import componentStyles from './Report.module.scss'
import { ReportProps } from './Report.types'
import { buildGridTemplateAreas } from './utils'
import { TimeSeries, TimeSeriesProps } from '../TimeSeries'
import { Leaderboard, LeaderboardProps } from '../Leaderboard'
import { Counter, CounterProps } from '../Counter'
import { Loader } from '../Loader'
import { useReport } from '../../hooks/useReport'

const componentMap = {
  timeSeries: (args: TimeSeriesProps) => <TimeSeries style={{ maxHeight: '240px' }} {...args} />,
  leaderboard: (args: LeaderboardProps) => <Leaderboard {...args} style={{ height: '100%' }} />,
  counter: (args: CounterProps) => <Counter {...args} />,
  pie: (args: PieChartProps) => (
    <PieChart
      className={componentStyles.pie}
      chartProps={{ hideLegend: true }}
      chartConfigProps={(config) => ({ ...config, options: { ...config.options, maintainAspectRatio: true } })}
      {...args}
    />
  ),
  '': () => null
}

export const ReportComponent = React.forwardRef<HTMLDivElement, ReportProps>((props, ref) => {
  const {
    title: titleProp,
    layout: layoutProp,
    charts: chartsProp,
    clickable = false,
    onCardClick,
    reportCardProps,
    propelApiUrl,
    query,
    className,
    style,
    ...rest
  } = props

  const isStatic = query?.accessToken == null

  const { data, isLoading: isLoadingReport } = useReport({ ...query, enabled: !isStatic })

  const charts = isStatic ? chartsProp : data?.report?.charts
  const layout = isStatic ? layoutProp : data?.report?.layout
  const title = isStatic ? titleProp : data?.report?.uniqueName

  const { charts: reportCharts, isLoading: isLoadingComponents } = useReportComponents(charts, {
    propelApiUrl: propelApiUrl ?? query?.propelApiUrl,
    accessToken: query?.accessToken
  })

  const isLoading = (!isStatic && isLoadingReport) || isLoadingComponents

  const gridTemplateAreas = buildGridTemplateAreas(layout)

  return (
    <div ref={ref} className={classNames(componentStyles.container, className)} style={style} {...rest}>
      {title != null && (
        <header>
          <h1 className={componentStyles.title}>{title}</h1>
          <p>
            Powered by{' '}
            <a href="https://www.propeldata.com/" target="_blank" rel="noreferrer">
              Propel
            </a>
          </p>
        </header>
      )}
      <div
        className={componentStyles.reportGrid}
        style={{
          gridTemplateAreas,
          gridTemplateRows: layout?.map(() => '1fr').join(' '),
          gridTemplateColumns: layout?.[0]?.map(() => '1fr').join(' ')
        }}
      >
        {reportCharts?.map((chart, chartIdx) => (
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
            <header className={componentStyles.cardTitle}>{chart.title != null && <h2>{chart.title}</h2>}</header>
            <div>
              {!isLoading ? (
                chart.result != null &&
                chart.type != null &&
                componentMap[chart.type as 'timeSeries' | 'leaderboard' | 'counter' | 'pie']({
                  ...chart.result[chart.type === 'pie' ? 'leaderboard' : chart.type]
                })
              ) : (
                <Loader className={componentStyles.loader} />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
})

ReportComponent.displayName = 'ReportComponent'

/**
 * @deprecated
 * This component is EXPERIMENTAL, we do not recommend using it in production.
 */
export const Report = withContainer(ReportComponent, ErrorFallback) as typeof ReportComponent
