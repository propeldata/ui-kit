export type PaddingOptions =
  | number
  | {
      top?: number
      bottom?: number
      right?: number
      left?: number
    }

export type TimeSeriesData = {
  values?: string[]
  labels?: string[]
}

export type BarStyles = {
  variant: 'bar'
  border?: {
    width?: number
    radius?: number
    color?: string
    hoverColor?: string
  }
  background?: {
    color?: string
    hoverColor?: string
  }
  font?: {
    color?: string
    family?: string
    size?: number
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
  }
  canvas?: {
    backgroundColor?: string
    padding?: PaddingOptions
    borderRadius?: string
  }
}

export type LineStyles = {
  variant: 'line'
  border?: {
    width?: number
    radius?: number
    color?: string
    hoverColor?: string
  }
  background?: {
    color?: string
    hoverColor?: string
  }
  font?: {
    color?: string
    family?: string
    size?: number
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
  }
  point?: {
    style?: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle'
    background?: {
      color?: string
      hoverColor?: string
    }
    border?: {
      color?: string
      width?: string
      hoverColor?: string
      hoverWidth?: string
    }
    hit?: {
      radius?: string
    }
    radius?: string
    hoverRadius?: string
    rotation?: string
  }
  canvas?: {
    backgroundColor?: string
    padding?: PaddingOptions
    borderRadius?: string
  }
}

export type Variant = 'bar' | 'line'

export enum RelativeTimeRange {
  /** @deprecated Use `LAST_N_YEARS` instead. */
  Last_2Years = 'LAST_2_YEARS',
  /** @deprecated Use `LAST_N_MONTHS` instead. */
  Last_3Months = 'LAST_3_MONTHS',
  /** @deprecated Use `LAST_N_HOURS` instead. */
  Last_4Hours = 'LAST_4_HOURS',
  /** @deprecated Use `LAST_N_YEARS` instead. */
  Last_5Years = 'LAST_5_YEARS',
  /** @deprecated Use `LAST_N_MONTHS` instead. */
  Last_6Months = 'LAST_6_MONTHS',
  /** @deprecated Use `LAST_N_DAYS` instead. */
  Last_7Days = 'LAST_7_DAYS',
  /** @deprecated Use `LAST_N_HOURS` instead. */
  Last_12Hours = 'LAST_12_HOURS',
  /** @deprecated Use `LAST_N_MINUTES` instead. */
  Last_15Minutes = 'LAST_15_MINUTES',
  /** @deprecated Use `LAST_N_HOURS` instead. */
  Last_24Hours = 'LAST_24_HOURS',
  /** @deprecated Use `LAST_N_DAYS` instead. */
  Last_30Days = 'LAST_30_DAYS',
  /** @deprecated Use `LAST_N_MINUTES` instead. */
  Last_30Minutes = 'LAST_30_MINUTES',
  /** @deprecated Use `LAST_N_DAYS` instead. */
  Last_90Days = 'LAST_90_DAYS',
  /** @deprecated Use `LAST_N_HOURS` instead. */
  LastHour = 'LAST_HOUR',
  /** Starts at 12:00:00 AM, `n` - 1 day(s) before the current day, and continues through the current day. It includes today. */
  LastNDays = 'LAST_N_DAYS',
  /** Starts at the zeroth minute of the `n` - 1 hour(s) before the current hour, and continues through the current hour. It includes this hour. */
  LastNHours = 'LAST_N_HOURS',
  /** Starts at the zeroth second `n` - 1 minute(s) before the current minute and continues through the current minute. It includes this minute. */
  LastNMinutes = 'LAST_N_MINUTES',
  /** Starts at 12:00:00 AM on the first day of the month, `n` - 1 month(s) before the current month, and continues through the current month. It includes this month. */
  LastNMonths = 'LAST_N_MONTHS',
  /** Starts at 12:00:00 AM on the first day of the calendar quarter `n` - 1 quarter(s) before the current quarter and continues through the current quarter. It includes this quarter. */
  LastNQuarters = 'LAST_N_QUARTERS',
  /** Starts on Monday, 12:00:00 AM, `n` - 1 week(s) before the current week, and continues through the current week. It includes this week. */
  LastNWeeks = 'LAST_N_WEEKS',
  /** Starts on January 1st, 12:00:00 AM of the year `n` - 1 year(s) before the current year and continues through the current year. It includes this year. */
  LastNYears = 'LAST_N_YEARS',
  /** @deprecated Use `LAST_N_YEARS` instead. */
  LastYear = 'LAST_YEAR',
  /**  Starts at the zeroth minute of the next hour and continues for 60 minutes. */
  NextHour = 'NEXT_HOUR',
  /** Starts at 12:00:00 AM on the first day of the next month and continues for the duration of the month. */
  NextMonth = 'NEXT_MONTH',
  /** Starts at 12:00:00 AM on the first day of the next calendar quarter and continues for the duration of the quarter. */
  NextQuarter = 'NEXT_QUARTER',
  /** Starts on Monday, 12:00:00 AM, the week after the current week, and continues for the duration of the week. */
  NextWeek = 'NEXT_WEEK',
  /** Starts on January 1st, 12:00:00 AM of the next year and continues for the duration of the year. */
  NextYear = 'NEXT_YEAR',
  /** Starts at the zeroth minute of the previous hour and continues for 60 minutes. */
  PreviousHour = 'PREVIOUS_HOUR',
  /** Starts at 12:00:00 AM on the first day of the month before the current month and continues for the duration of the month. */
  PreviousMonth = 'PREVIOUS_MONTH',
  /** Starts at 12:00:00 AM on the first day of the calendar quarter before the current quarter and continues for the duration of the quarter. */
  PreviousQuarter = 'PREVIOUS_QUARTER',
  /** Starts on Monday, 12:00:00 AM, a week before the current week, and continues for seven days. */
  PreviousWeek = 'PREVIOUS_WEEK',
  /** Starts on January 1st, 12:00:00 AM, the year before the current year, and continues for the duration of the year. */
  PreviousYear = 'PREVIOUS_YEAR',
  /** Starts at the zeroth minute of the current hour and continues for 60 minutes. */
  ThisHour = 'THIS_HOUR',
  /** Starts at 12:00:00 AM on the first day of the current month and continues for the duration of the month. */
  ThisMonth = 'THIS_MONTH',
  /** Starts at 12:00:00 AM on the first day of the current calendar quarter and continues for the duration of the quarter. */
  ThisQuarter = 'THIS_QUARTER',
  /** Starts on Monday, 12:00:00 AM of the current week and continues for seven days. */
  ThisWeek = 'THIS_WEEK',
  /** Starts on January 1st, 12:00:00 AM of the current year and continues for the duration of the year. */
  ThisYear = 'THIS_YEAR',
  /** Starts at 12:00:00 AM of the current day and continues for 24 hours. */
  Today = 'TODAY',
  /** " Starts at 12:00:00 AM, the day after the current day, and continues for 24 hours. */
  Tomorrow = 'TOMORROW',
  /** Starts at 12:00:00 AM on the day before the today and continues for 24 hours. */
  Yesterday = 'YESTERDAY'
}

export enum TimeSeriesGranularity {
  /** Aggregates values by daily intervals. */
  Day = 'DAY',
  /** Aggregates values by 15-minute intervals. */
  FifteenMinutes = 'FIFTEEN_MINUTES',
  /** Aggregates values by 5-minute intervals. */
  FiveMinutes = 'FIVE_MINUTES',
  /** Aggregates values by hourly intervals. */
  Hour = 'HOUR',
  /** Aggregates values by minute intervals. */
  Minute = 'MINUTE',
  /** Aggregates values by monthly intervals. */
  Month = 'MONTH',
  /** Aggregates values by 10-minute intervals. */
  TenMinutes = 'TEN_MINUTES',
  /** Aggregates values by weekly intervals. */
  Week = 'WEEK',
  /** Aggregates values by yearly intervals. */
  Year = 'YEAR'
}
