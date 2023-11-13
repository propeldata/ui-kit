import { Chart, ScaleOptionsByType, TimeUnit } from 'chart.js'
import type { DeepPartial } from 'chart.js/dist/types/utils'
import { DateTime } from 'luxon'
import { Maybe, RelativeTimeRange, TimeRangeInput, TimeSeriesGranularity } from '../../helpers'

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

  if (!relative && !labels) {
    // TODO(mroberts): In a future release, we should calculate this for absolute ranges, too.
    //   Actually, all of this logic should move to the backend.
    return TimeSeriesGranularity.Day
  }

  if (!relative) {
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
  const granularityByDistanceDictionary = {
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
  chart?: Chart
}

export function getScales({ granularity, isFormatted, zone, chart }: GetScalesOptions) {
  const scales = chart?.options?.scales
  const scale = scales?.y?.type ?? 'linear'
  const beginAtZero = (scales as DeepPartial<{ [key: string]: ScaleOptionsByType<'linear'> }>)?.y?.beginAtZero ?? false

  const scalesBase = {
    x: {
      display: scales?.x?.display ?? true,
      grid: {
        drawOnChartArea: false
      },
      beginAtZero
    },
    y: {
      display: scales?.y?.display ?? true,
      grid: { drawOnChartArea: true },
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

  return (
    {
      [TimeSeriesGranularity.Day]: DateTime.fromJSDate(date).toFormat('LLL d, yyyy'),
      [TimeSeriesGranularity.Week]: DateTime.fromJSDate(date).toFormat('LLL d, yyyy'),
      [TimeSeriesGranularity.Month]: DateTime.fromJSDate(date).toFormat('LLLL, yyyy'),
      [TimeSeriesGranularity.Year]: DateTime.fromJSDate(date).toFormat('yyyy')
    }[granularity] ?? title
  )
}

export function getNumericValues(values: Array<string | number>, log: Log) {
  let nonNumericValueFound = false

  const newValues = values.map((value: string | number) => {
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
