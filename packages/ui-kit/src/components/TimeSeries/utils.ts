import { Maybe, RelativeTimeRange, TimeRangeInput, TimeSeriesGranularity } from '../../helpers/graphql'
import {
  Chart,
  ChartTypeRegistry,
  PointStyle,
  ScaleOptionsByType,
  Scriptable,
  ScriptableAndArray,
  ScriptableContext,
  ScriptableTooltipContext,
  TextAlign,
  TimeUnit
} from 'chart.js'
import type { DeepPartial } from 'chart.js/dist/types/utils'
import React from 'react'
import { defaultStyles } from './defaults'

import { ChartPlugins, ChartScales, ChartVariant, Styles } from './types'

export function getGranularityBasedUnit(granularity?: Maybe<TimeSeriesGranularity>): false | TimeUnit {
  const unitByGranularity = {
    [TimeSeriesGranularity.Year]: 'year',
    [TimeSeriesGranularity.Month]: 'month',
    [TimeSeriesGranularity.Week]: 'week',
    [TimeSeriesGranularity.Day]: 'day',
    [TimeSeriesGranularity.Hour]: 'hour',
    [TimeSeriesGranularity.Minute]: 'minute'
  } as Record<TimeSeriesGranularity, TimeUnit>

  return granularity ? unitByGranularity[granularity] || false : false
}

interface FormatLabelsOptions {
  labels?: string[]
  formatter?: (labels: string[]) => string[]
}

export function formatLabels(options: FormatLabelsOptions): string[] | undefined {
  const { labels, formatter } = options

  if (formatter && typeof formatter !== 'function') {
    throw new Error('`labelFormatter` prop must be a formatter function')
  }

  return formatter ? formatter(labels || []) : labels
}

export function getDefaultGranularity(timeRange?: TimeRangeInput) {
  const relative = timeRange?.relative

  if (!relative) {
    // TODO(mroberts): In a future release, we should calculate this for absolute ranges, too.
    //   Actually, all of this logic should move to the backend.
    return TimeSeriesGranularity.Day
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

      Chart.defaults.elements.bar.backgroundColor = styles?.bar?.backgroundColor || defaultStyles.bar.backgroundColor
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

interface UpdateChartStylesOptions {
  chart: Chart
  styles?: Styles
  variant: ChartVariant
}

export function updateChartStyles(options: UpdateChartStylesOptions) {
  const { chart, styles, variant } = options

  const dataset = chart.data.datasets[0]

  if (variant === 'bar') {
    dataset.backgroundColor = styles?.bar?.backgroundColor || defaultStyles.bar.backgroundColor
    dataset.borderColor = styles?.bar?.borderColor || defaultStyles.bar.borderColor
    dataset.borderWidth = styles?.bar?.borderWidth || defaultStyles.bar.borderWidth
    dataset.hoverBackgroundColor = styles?.bar?.hoverBackgroundColor || defaultStyles.bar.hoverBackgroundColor
    dataset.hoverBorderColor = styles?.bar?.hoverBorderColor || defaultStyles.bar.hoverBorderColor
  } else {
    dataset.backgroundColor = styles?.line?.backgroundColor || defaultStyles.line.backgroundColor
    dataset.borderColor = styles?.line?.borderColor || defaultStyles.line.borderColor
    dataset.borderWidth = styles?.line?.borderWidth || defaultStyles.line.borderWidth
    dataset.hoverBackgroundColor = styles?.line?.hoverBackgroundColor || defaultStyles.line.hoverBackgroundColor
    dataset.hoverBorderColor = styles?.line?.hoverBorderColor || defaultStyles.line.hoverBorderColor
  }

  if (chart.options.layout) {
    chart.options.layout.padding = styles?.canvas?.padding || defaultStyles.canvas.padding
  }
}

interface UpdateChartConfig {
  chart: Chart
  values: Array<number | null>
  labels: string[]
  scales: ChartScales
  variant: ChartVariant
  customPlugins: ChartPlugins
}

export function updateChartConfig(options: UpdateChartConfig) {
  const { chart, labels, values, scales, variant, customPlugins } = options

  const dataset = chart.data.datasets[0]

  chart.data.labels = labels
  dataset.data = values
  chart.options.scales = scales
  dataset.type = variant

  chart.options.plugins = customPlugins
}

interface GetScalesOptions {
  styles?: Styles
  granularity: TimeSeriesGranularity | null
  isFormatted: boolean
  isStatic: boolean
}

export function getScales(options: GetScalesOptions) {
  const { styles, granularity, isFormatted, isStatic } = options
  const scale = styles?.yAxis?.scale || defaultStyles.yAxis.scale

  const hideGridLines = styles?.canvas?.hideGridLines || defaultStyles.canvas.hideGridLines

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
      beginAtZero: styles?.yAxis?.beginAtZero || defaultStyles.yAxis.beginAtZero,
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

  const currentFormatScales = isFormatted || isStatic ? customFormatScales : autoFormatScales

  if (scale === 'linear') {
    const linearScales: DeepPartial<{ [key: string]: ScaleOptionsByType<'linear'> }> = {
      ...currentFormatScales,
      y: {
        ...currentFormatScales.y,
        type: 'linear'
      }
    }

    return linearScales
  }

  const logarithmicScales: DeepPartial<{ [key: string]: ScaleOptionsByType<'logarithmic'> }> = {
    ...(isFormatted || isStatic ? customFormatScales : autoFormatScales),
    y: {
      ...currentFormatScales.y,
      type: 'logarithmic'
    }
  }

  return logarithmicScales
}
