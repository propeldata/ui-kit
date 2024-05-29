import { DateRangeOptionsProps } from './TimeRangePicker.types'
import { RelativeTimeRange } from '../../graphql'

export const defaultOptions: DateRangeOptionsProps[] = [
  {
    value: 'today',
    label: 'Today',
    params: {
      relative: RelativeTimeRange.Today
    }
  },
  {
    value: 'this-week',
    label: 'This week',
    params: {
      relative: RelativeTimeRange.ThisWeek
    }
  },
  {
    value: 'this-month',
    label: 'This month',
    params: {
      relative: RelativeTimeRange.ThisMonth
    }
  },
  {
    value: 'this-year',
    label: 'This year',
    params: {
      relative: RelativeTimeRange.ThisYear
    }
  },
  {
    value: 'last-7-days',
    label: 'Last 7 days',
    params: {
      relative: RelativeTimeRange.LastNDays,
      n: 7
    }
  },
  {
    value: 'last-30-days',
    label: 'Last 30 days',
    params: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  },
  {
    value: 'last-90-days',
    label: 'Last 90 days',
    params: {
      relative: RelativeTimeRange.LastNDays,
      n: 90
    }
  },
  {
    value: 'last-365-days',
    label: 'Last 365 days',
    params: {
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

export const FROM_DATE_UNTIL_NOW = 'from-date-until-now'
export const CUSTOM_DATE_RANGE = 'custom-date-range'
