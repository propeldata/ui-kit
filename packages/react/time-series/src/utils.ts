import React from 'react'
import {
  Chart,
  ChartTypeRegistry,
  TextAlign,
  Scriptable,
  ScriptableTooltipContext,
  PointStyle,
  ScriptableAndArray,
  ScriptableContext
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'
import { Maybe, RelativeTimeRange, TimeRangeInput, TimeSeriesGranularity } from '@propeldata/ui-kit-graphql'

import { TimeSeriesData, Styles, ChartVariant, CustomPlugins } from './types'
import { defaultStyles } from './defaults'

function getGranularityBasedUnit(granularity?: Maybe<TimeSeriesGranularity>): string | false {
  const unitByGranularity = {
    [TimeSeriesGranularity.Year]: 'year',
    [TimeSeriesGranularity.Month]: 'month',
    [TimeSeriesGranularity.Week]: 'week',
    [TimeSeriesGranularity.Day]: 'day',
    [TimeSeriesGranularity.Hour]: 'hour',
    [TimeSeriesGranularity.Minute]: 'minute'
  } as Record<TimeSeriesGranularity, string>

  return granularity ? unitByGranularity[granularity] || false : false
}

interface GenerateConfigOptions {
  variant: ChartVariant
  styles?: Styles
  data: TimeSeriesData
  granularity: Maybe<TimeSeriesGranularity>
  isFormatted: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateConfig(options: GenerateConfigOptions): any {
  const { styles, data, variant, granularity, isFormatted } = options

  const hideGridLines = styles?.canvas?.hideGridLines || defaultStyles.canvas.hideGridLines
  const backgroundColor = styles?.[variant]?.backgroundColor || defaultStyles[variant].backgroundColor
  const borderColor = styles?.[variant]?.borderColor || defaultStyles[variant].borderColor

  const labels = data.labels || []
  const values = data.values || []

  const plugins = [customCanvasBackgroundColor]

  const customPlugins = {
    customCanvasBackgroundColor: {
      color: styles?.canvas?.backgroundColor
    }
  } as CustomPlugins

  const dataset = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderColor
      }
    ]
  }

  const scalesBase = {
    x: {
      display: !hideGridLines,
      grid: {
        drawOnChartArea: false
      },
      beginAtZero: true
    },
    y: {
      display: !hideGridLines,
      grid: { drawOnChartArea: true }
    }
  }

  const customFormatScales = {
    ...scalesBase
  }

  const autoFormatScales = {
    ...scalesBase,
    x: {
      ...scalesBase.x,
      type: 'timeseries',
      time: {
        unit: getGranularityBasedUnit(granularity)
      }
    }
  }

  return {
    type: variant,
    data: dataset,
    options: {
      responsive: !styles?.canvas?.width,
      maintainAspectRatio: false,
      animation: false,
      plugins: customPlugins,
      layout: {
        padding: styles?.canvas?.padding
      },
      scales: isFormatted ? customFormatScales : autoFormatScales
    },
    plugins
  }
}

export function useSetupDefaultStyles(styles?: Styles) {
  React.useEffect(() => {
    async function setupDefaultStyles() {
      const pointStyle = styles?.point?.style as ScriptableAndArray<
        PointStyle,
        ScriptableContext<keyof ChartTypeRegistry>
      >

      const font = {
        family: styles?.font?.family,
        size: styles?.font?.size as Scriptable<number | undefined, ScriptableTooltipContext<keyof ChartTypeRegistry>>,
        style: styles?.font?.style,
        lineHeight: styles?.font?.lineHeight,
        color: styles?.font?.color || defaultStyles.font.color
      }

      Chart.defaults.color = styles?.font?.color || defaultStyles.font.color

      Chart.defaults.elements.point.pointStyle = pointStyle === undefined ? 'circle' : pointStyle
      Chart.defaults.elements.point.radius = styles?.point?.radius || defaultStyles.point.radius
      Chart.defaults.elements.point.backgroundColor =
        styles?.point?.backgroundColor || defaultStyles.point.backgroundColor
      Chart.defaults.elements.point.borderColor = styles?.point?.borderColor || defaultStyles.point.borderColor
      Chart.defaults.elements.point.borderWidth = styles?.point?.borderWidth || defaultStyles.point.borderWidth
      Chart.defaults.elements.point.hoverBorderColor =
        styles?.point?.hoverBorderColor || defaultStyles.point.hoverBorderColor
      Chart.defaults.elements.point.hoverBackgroundColor =
        styles?.point?.hoverBackgroundColor || defaultStyles.point.hoverBackgroundColor

      Chart.defaults.elements.bar.borderWidth = styles?.bar?.borderWidth || defaultStyles.bar.borderWidth
      Chart.defaults.elements.bar.borderRadius = styles?.bar?.borderRadius || defaultStyles.bar.borderRadius
      Chart.defaults.elements.bar.borderColor = styles?.bar?.borderColor || defaultStyles.bar.borderColor
      Chart.defaults.elements.bar.hoverBackgroundColor =
        styles?.bar?.hoverBackgroundColor || defaultStyles.bar.hoverBackgroundColor
      Chart.defaults.elements.bar.hoverBorderColor = styles?.bar?.hoverBorderColor || defaultStyles.bar.hoverBorderColor

      Chart.defaults.elements.line.tension = styles?.line?.tension || defaultStyles.line.tension
      Chart.defaults.elements.line.borderWidth = styles?.line?.borderWidth || defaultStyles.line.borderWidth
      Chart.defaults.elements.line.stepped = styles?.line?.stepped || defaultStyles.line.stepped
      Chart.defaults.elements.line.borderColor = styles?.line?.borderColor || defaultStyles.line.borderColor

      Chart.defaults.plugins.tooltip.enabled =
        styles?.tooltip?.display !== undefined ? styles?.tooltip?.display : defaultStyles.tooltip.display
      Chart.defaults.plugins.tooltip.padding = styles?.tooltip?.padding || defaultStyles.tooltip.padding
      Chart.defaults.plugins.tooltip.backgroundColor =
        styles?.tooltip?.backgroundColor || defaultStyles.tooltip.backgroundColor
      Chart.defaults.plugins.tooltip.bodyColor = styles?.tooltip?.color || defaultStyles.tooltip.color
      Chart.defaults.plugins.tooltip.titleColor = styles?.tooltip?.color || defaultStyles.tooltip.color
      Chart.defaults.plugins.tooltip.borderColor = styles?.tooltip?.borderColor || defaultStyles.tooltip.borderColor
      Chart.defaults.plugins.tooltip.borderWidth = styles?.tooltip?.borderWidth || defaultStyles.tooltip.borderWidth
      Chart.defaults.plugins.tooltip.caretSize = styles?.tooltip?.caretSize || defaultStyles.tooltip.caretSize
      Chart.defaults.plugins.tooltip.cornerRadius = styles?.tooltip?.borderRadius || defaultStyles.tooltip.borderRadius
      Chart.defaults.plugins.tooltip.titleFont = font
      Chart.defaults.plugins.tooltip.titleAlign = styles?.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
      Chart.defaults.plugins.tooltip.bodyAlign = styles?.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
    }

    setupDefaultStyles()
  }, [styles])
}

export function getDefaultGranularity(timeRange?: TimeRangeInput) {
  const relative = timeRange?.relative

  if (!relative) {
    return null
  }

  return {
    [RelativeTimeRange.LastNDays]: TimeSeriesGranularity.Day,
    [RelativeTimeRange.LastNHours]: TimeSeriesGranularity.Hour,
    [RelativeTimeRange.LastNMinutes]: TimeSeriesGranularity.Minute,
    [RelativeTimeRange.LastNMonths]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.LastNQuarters]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.LastNWeeks]: TimeSeriesGranularity.Year,
    [RelativeTimeRange.LastNYears]: TimeSeriesGranularity.Year,
    [RelativeTimeRange.Today]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.Yesterday]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.Tomorrow]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.NextHour]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.NextMonth]: TimeSeriesGranularity.Week,
    [RelativeTimeRange.NextQuarter]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.NextWeek]: TimeSeriesGranularity.Day,
    [RelativeTimeRange.NextYear]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.PreviousHour]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.PreviousMonth]: TimeSeriesGranularity.Week,
    [RelativeTimeRange.PreviousQuarter]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.PreviousWeek]: TimeSeriesGranularity.Day,
    [RelativeTimeRange.PreviousYear]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.ThisHour]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.ThisMonth]: TimeSeriesGranularity.Week,
    [RelativeTimeRange.ThisQuarter]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.ThisWeek]: TimeSeriesGranularity.Day,
    [RelativeTimeRange.ThisYear]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.LastHour]: TimeSeriesGranularity.FifteenMinutes,
    [RelativeTimeRange.LastYear]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.Last_12Hours]: TimeSeriesGranularity.Hour,
    [RelativeTimeRange.Last_15Minutes]: TimeSeriesGranularity.Minute,
    [RelativeTimeRange.Last_24Hours]: TimeSeriesGranularity.Hour,
    [RelativeTimeRange.Last_2Years]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.Last_30Days]: TimeSeriesGranularity.Day,
    [RelativeTimeRange.Last_30Minutes]: TimeSeriesGranularity.Minute,
    [RelativeTimeRange.Last_3Months]: TimeSeriesGranularity.Week,
    [RelativeTimeRange.Last_4Hours]: TimeSeriesGranularity.Hour,
    [RelativeTimeRange.Last_5Years]: TimeSeriesGranularity.Year,
    [RelativeTimeRange.Last_6Months]: TimeSeriesGranularity.Month,
    [RelativeTimeRange.Last_7Days]: TimeSeriesGranularity.Day,
    [RelativeTimeRange.Last_90Days]: TimeSeriesGranularity.Day
  }[relative]
}

interface FormatLabelsOptions {
  labels?: string[]
  formatter?: (labels: string[]) => string[]
}

export function formatLabels(options: FormatLabelsOptions): string[] {
  const { labels = [], formatter } = options

  if (formatter && typeof formatter !== 'function') {
    throw new Error('`labelFormatter` prop must be a formatter function')
  }

  return formatter ? formatter(labels) : labels
}
