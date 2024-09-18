'use client'

import { Chart, ChartDataset, ScaleOptionsByType, TimeUnit } from 'chart.js'
import type { DeepPartial } from 'chart.js/dist/types/utils'
import { DateTime } from 'luxon'
import * as radixColors from '@radix-ui/colors'

import { AccentColors, GrayColors, ThemeTokenProps, palette, PaletteColor } from '../../themes'
import { Maybe, RelativeTimeRange, TimeRangeInput, TimeSeriesGranularity } from '../../graphql'
import { getDisplayValue, getPixelFontSizeAsNumber } from '../../helpers'
import { Log } from '../Log'
import { ThemeStateProps } from '../ThemeProvider'
import { TimeSeriesChartVariant, TimeSeriesData } from './TimeSeries.types'

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

interface GetDefaultGranularityOptions {
  timeRange?: TimeRangeInput
  labels?: string[]
}

export function getDefaultGranularity(options: GetDefaultGranularityOptions): TimeSeriesGranularity {
  const relative = options.timeRange?.relative
  const labels = options.labels

  if (!(relative && labels)) {
    // TODO(mroberts): In a future release, we should calculate this for absolute ranges, too.
    //   Actually, all of this logic should move to the backend.
    return TimeSeriesGranularity.Day
  }

  if (!relative && labels) {
    return getLabelsBasedGranularity(labels)
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

export function getLabelsBasedGranularity(labels: string[]): TimeSeriesGranularity {
  let timestamps = [...labels]

  const isAllTimestamps = labels.every((label) => isTimestamp(label))

  if (!isAllTimestamps) {
    try {
      timestamps = labels.map((label) => convertToTimestamp(label))
    } catch {
      return TimeSeriesGranularity.Day
    }
  }

  const granularity = getGranularityByDistance(timestamps)

  return granularity
}

export function isTimestamp(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
}

export function convertToTimestamp(value: string) {
  return new Date(value).toISOString()
}

export function getGranularityByDistance(timestamps: string[]): TimeSeriesGranularity {
  const granularityByDistanceDictionary: { [key: string]: TimeSeriesGranularity } = {
    '86400000': TimeSeriesGranularity.Day,
    '900000': TimeSeriesGranularity.FifteenMinutes,
    '300000': TimeSeriesGranularity.FiveMinutes,
    '3600000': TimeSeriesGranularity.Hour,
    '60000': TimeSeriesGranularity.Minute,
    '2592000000': TimeSeriesGranularity.Month,
    '604800000': TimeSeriesGranularity.Week,
    '31536000000': TimeSeriesGranularity.Year,
    '600000': TimeSeriesGranularity.TenMinutes
  }

  const timestampsInMilliseconds = timestamps.map((timestamp) => new Date(timestamp).getTime())

  const distances = timestampsInMilliseconds.map((timestamp, index) => {
    if (index === 0) {
      return 0
    }

    return timestamp - timestampsInMilliseconds[index - 1]
  })

  distances.shift()

  const isSameDistances = distances.every((distance) => distance === distances[0])
  const granularityInDictionary = granularityByDistanceDictionary[distances[0]]

  if (!isSameDistances || !granularityInDictionary) {
    const timestampYears = timestampsInMilliseconds.map((timestamp) => new Date(timestamp).getFullYear())
    const timestampMonths = timestampsInMilliseconds.map((timestamp) => new Date(timestamp).getUTCMonth())

    const isYearGranularity = timestampYears.every((year, idx) => idx === 0 || year - timestampYears[idx - 1] === 1)
    if (isYearGranularity) return TimeSeriesGranularity.Year

    const isMonthGranularity = timestampMonths.every(
      (month, idx) => idx === 0 || month - timestampMonths[idx - 1] === 1 || month - timestampMonths[idx - 1] === -11
    )

    if (isMonthGranularity) return TimeSeriesGranularity.Month

    return TimeSeriesGranularity.Day
  }

  return granularityInDictionary
}

interface GetScalesOptions {
  granularity: TimeSeriesGranularity | null
  isFormatted: boolean
  zone: string
  chart?: Chart | null
  variant: TimeSeriesChartVariant
  grid?: boolean
  theme?: ThemeStateProps
  stacked?: boolean
}

export function getScales({
  granularity,
  isFormatted,
  zone,
  chart,
  variant,
  grid,
  theme,
  stacked = false
}: GetScalesOptions) {
  const scales = chart?.options?.scales as DeepPartial<{ [key: string]: ScaleOptionsByType<'linear'> }>
  const scale = scales?.y?.type ?? 'linear'
  const beginAtZero = scales?.y?.beginAtZero ?? false
  const padding = variant === 'line' ? 5 : 9

  const scalesBase = {
    x: {
      display: scales?.x?.display ?? true,
      grid: {
        drawOnChartArea: grid,
        drawTicks: variant === 'line'
      },
      ticks: {
        padding,
        color: theme?.getVar('--propel-gray-11'),
        font: {
          size: getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-1'))
        }
      },
      beginAtZero,
      stacked
    },
    y: {
      display: scales?.y?.display ?? true,
      grid: {
        color: theme?.getVar('--propel-gray-a8'),
        drawOnChartArea: true
      },
      ticks: {
        padding,
        color: theme?.getVar('--propel-gray-11'),
        font: {
          size: getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-1'))
        }
      },
      border: {
        display: false
      },
      beginAtZero,
      stacked
    }
  }

  const customFormatScales = {
    ...scalesBase
  }

  const autoFormatScales = {
    ...scalesBase,
    x: {
      ...scalesBase.x,
      type: 'time',
      time: {
        isoWeekday: true,
        unit: getGranularityBasedUnit(granularity)
      },
      adapters: {
        date: {
          zone
        }
      }
    }
  }

  const currentFormatScales = isFormatted ? customFormatScales : autoFormatScales

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
    ...(isFormatted ? customFormatScales : autoFormatScales),
    y: {
      ...currentFormatScales.y,
      type: 'logarithmic'
    }
  }

  return logarithmicScales
}

export function tooltipTitleCallback(context: { label: string }[], granularity: TimeSeriesGranularity) {
  const title = context[0].label
  const date = new Date(title)

  switch (granularity) {
    case TimeSeriesGranularity.Day:
      return DateTime.fromJSDate(date).toFormat('LLL d, yyyy')
    case TimeSeriesGranularity.Week:
      return DateTime.fromJSDate(date).toFormat('LLL d, yyyy')
    case TimeSeriesGranularity.Month:
      return DateTime.fromJSDate(date).toFormat('LLLL, yyyy')
    case TimeSeriesGranularity.Year:
      return DateTime.fromJSDate(date).toFormat('yyyy')
    default:
      return title
  }
}

export function getNumericValues(values: Array<string | number | null>, log: Log) {
  let nonNumericValueFound = false

  const newValues = values.map((value: string | number | null) => {
    if (typeof value === 'number') return value

    const displayValue = getDisplayValue({ value })

    if (typeof displayValue !== 'number') {
      nonNumericValueFound = true
      return null
    }

    return displayValue
  })

  if (nonNumericValueFound) {
    log.warn('TimeSeries contains non-numeric values; these values will be set to null')
  }

  return newValues
}

interface BuildDatasetsOptions {
  fill?: boolean
  maxGroupBy: number
  showGroupByOther: boolean
  accentColors: AccentColors[]
  otherColor?: GrayColors
}

export function buildDatasets(
  data: TimeSeriesData,
  theme: ThemeTokenProps,
  options: BuildDatasetsOptions,
  log: Log
): ChartDataset<TimeSeriesChartVariant>[] {
  const { values, groups } = data

  const { fill = false, maxGroupBy, showGroupByOther, accentColors, otherColor } = options ?? {}

  const borderRadius = Math.max(
    getPixelFontSizeAsNumber(theme?.getVar('--propel-radius-2')),
    getPixelFontSizeAsNumber(theme?.getVar('--propel-radius-full'))
  )

  if (groups == null || groups.length === 0) {
    return [
      {
        data: getNumericValues(values ?? [], log),
        backgroundColor: theme?.getVar('--propel-accent-8'),
        borderColor: theme?.getVar('--propel-accent-8'),
        borderRadius,
        hoverBackgroundColor: theme?.getVar('--propel-accent-10'),
        pointBackgroundColor: theme?.getVar('--propel-accent-10'),
        pointHoverBackgroundColor: theme?.getVar('--propel-accent-10'),
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: theme?.getVar('--propel-accent-contrast'),
        fill
      } as ChartDataset<TimeSeriesChartVariant>
    ]
  }

  const accentColor = accentColors[0] ?? theme.accentColor

  const grayColor: PaletteColor = {
    name: 'gray',
    primary: theme.tokens[`${otherColor ?? theme.grayColor}8`] ?? radixColors.gray.gray8,
    secondary: theme.tokens[`${otherColor ?? theme.grayColor}10`] ?? radixColors.gray.gray10
  }

  const isCustomColors = accentColors.length > 0

  let customColors: (PaletteColor | undefined)[] = []

  let colorPos = palette.findIndex((value) => value?.name === accentColor)

  if (isCustomColors) {
    customColors = accentColors.map((color) => palette.find(({ name }) => name === color))

    const lastColorName = customColors[customColors.length - 1]?.name
    const lastColorIndex = palette.findIndex((color) => color.name === lastColorName)

    colorPos = lastColorIndex + 1
  }

  const orderedGroups = groups.sort((a, b) => {
    const sumA = a?.values?.reduce((sum, value) => Number(sum) + (Number(value) ?? 0), 0) ?? 0
    const sumB = b?.values?.reduce((sum, value) => Number(sum) + (Number(value) ?? 0), 0) ?? 0
    return Number(sumB) - Number(sumA)
  })

  const groupsToDisplay = orderedGroups.slice(0, maxGroupBy)

  const otherGroups = orderedGroups.slice(maxGroupBy)

  const otherValues: number[] = []
  otherGroups[0]?.values?.forEach((value, idx) => {
    let numberValue = Number(value)

    otherGroups.forEach((group) => {
      numberValue += Number(group?.values?.[idx])
    })

    otherValues.push(numberValue)
  })

  const other = {
    group: ['Other'],
    labels: groupsToDisplay[0].labels,
    values: otherValues
  }

  if (showGroupByOther === true) {
    groupsToDisplay.push(other)
  }

  const datasets = groupsToDisplay.map((group, idx) => {
    if (colorPos >= palette.length) colorPos = 0

    const extractedColor = customColors.shift()

    const color =
      extractedColor ??
      (group.group?.[0] === 'Other' && idx === groupsToDisplay.length - 1 ? grayColor : palette[colorPos])

    extractedColor == null && colorPos++

    const dataset = {
      data: getNumericValues(group?.values ?? [], log),
      backgroundColor: color.primary,
      borderColor: color.primary,
      borderRadius,
      pointHoverBorderWidth: 2,
      hoverBackgroundColor: color.secondary,
      pointBackgroundColor: color.secondary,
      pointHoverBackgroundColor: color.secondary,
      fill,
      label: group.group?.toString().replace(',', ', ')
    } as ChartDataset<TimeSeriesChartVariant>

    return dataset
  })

  if (datasets[datasets.length - 1].label === 'Other') {
    const otherDataset = datasets.pop()
    if (otherDataset) {
      datasets.unshift(otherDataset)
    }
  }

  return datasets
}
