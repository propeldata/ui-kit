import { DateRangeOptionsProps } from './TimeRangePicker.types'
import { RelativeTimeRange } from '../../helpers'

export const defaultOptions: DateRangeOptionsProps[] = [
  {
    uid: 'today',
    label: 'Today',
    value: {
      relative: RelativeTimeRange.Today
    }
  },
  {
    uid: 'this-week',
    label: 'This week',
    value: {
      relative: RelativeTimeRange.ThisWeek
    }
  },
  {
    uid: 'this-month',
    label: 'This month',
    value: {
      relative: RelativeTimeRange.ThisMonth
    }
  },
  {
    uid: 'this-year',
    label: 'This year',
    value: {
      relative: RelativeTimeRange.ThisYear
    }
  },
  {
    uid: 'last-7-days',
    label: 'Last 7 days',
    value: {
      relative: RelativeTimeRange.LastNDays,
      n: 7
    }
  },
  {
    uid: 'last-30-days',
    label: 'Last 30 days',
    value: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  },
  {
    uid: 'last-90-days',
    label: 'Last 90 days',
    value: {
      relative: RelativeTimeRange.LastNDays,
      n: 90
    }
  },
  {
    uid: 'last-365-days',
    label: 'Last 365 days',
    value: {
      relative: RelativeTimeRange.LastNDays,
      n: 365
    }
  }
]

export const lastNOptions = [
  { label: 'days', value: RelativeTimeRange.LastNDays },
  { label: 'weeks', value: RelativeTimeRange.LastNWeeks },
  { label: 'months', value: RelativeTimeRange.LastNMonths },
  { label: 'years', value: RelativeTimeRange.LastNYears }
]

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}

export const CUSTOM_RANGE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}

export const FROM_DATE_UNTIL_NOW = 'from-custom-date-until-now'
export const CUSTOM_DATE_RANGE = 'custom-fixed-date-range'
