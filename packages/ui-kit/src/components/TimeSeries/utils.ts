import { Chart, ScaleOptionsByType, TimeUnit } from 'chart.js'
import type { DeepPartial } from 'chart.js/dist/types/utils'
import { DateTime } from 'luxon'
import { getDisplayValue, Maybe, RelativeTimeRange, TimeRangeInput, TimeSeriesGranularity } from '../../helpers'
import { Log } from '../Log'
import { ThemeStateProps } from '../ThemeProvider'
import { TimeSeriesChartVariant } from './TimeSeries.types'

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
}

export function getScales({ granularity, isFormatted, zone, chart, variant, grid, theme }: GetScalesOptions) {
  const scales = chart?.options?.scales
  const scale = scales?.y?.type ?? 'linear'
  const beginAtZero = (scales as DeepPartial<{ [key: string]: ScaleOptionsByType<'linear'> }>)?.y?.beginAtZero ?? false
  const padding = variant === 'line' ? 5 : 9

  const scalesBase = {
    x: {
      display: scales?.x?.display ?? true,
      grid: {
        drawOnChartArea: grid,
        drawTicks: variant === 'line'
      },
      ticks: {
        padding
      },
      beginAtZero
    },
    y: {
      display: scales?.y?.display ?? true,
      grid: {
        color: theme?.colorSecondary,
        drawOnChartArea: true
      },
      ticks: {
        padding
      },
      border: {
        display: false
      },
      beginAtZero
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
