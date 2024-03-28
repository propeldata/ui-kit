import { DateRange } from 'react-day-picker'
import type { RelativeTimeRange } from '../../helpers'
import type { DefaultThemes } from '../ThemeProvider'

export type RelativeProps = {
  relative: RelativeTimeRange
  n?: number
}

export type DateRangeOptionValue = RelativeProps | DateRange

export type DateRangeOptionsProps = {
  uid: string
  label?: string
  value?: DateRangeOptionValue
}

export interface TimeRangePickerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  baseTheme?: DefaultThemes
  disableDateUntilNow?: boolean
  disableCustomRange?: boolean
  disableCustomRelative?: boolean
  disableOptions?: boolean
  disabled?: boolean
  defaultValue?: DateRangeOptionsProps
  value?: DateRangeOptionsProps
  options?: (defaultOptions: DateRangeOptionsProps[]) => DateRangeOptionsProps[] | undefined
  onChange?: (option: DateRangeOptionsProps | null) => void
}
