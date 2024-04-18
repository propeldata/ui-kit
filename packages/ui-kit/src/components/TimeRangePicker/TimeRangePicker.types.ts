import { DateRange } from 'react-day-picker'
import type { RelativeTimeRange } from '../../helpers'
import type { DefaultThemes } from '../ThemeProvider'

export type RelativeProps = {
  /** Specifies the type of relative time range, such as "last n days" or "last n months". */
  relative: RelativeTimeRange

  /** The quantity of the relative time unit to apply, e.g., '30' in "last 30 days". */
  n?: number
}

/**
 * Defines the possible values for a date range option.
 * This can be either a specific date range or a relative time range.
 */
export type DateRangeOptionValue = RelativeProps | DateRange

export type DateRangeOptionsProps = {
  /** A unique identifier for the date range option, used to distinguish between different options. */
  uid: string

  /** A human-readable label that describes the date range option. */
  label?: string

  /** The value of the date range option, which can be either a specific date range or a relative time range. */
  value?: DateRangeOptionValue
}

export interface TimeRangePickerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  /**
   * The initial theme used as a base. It provides a default set of styling
   * from which customizations can be applied.
   */
  baseTheme?: DefaultThemes

  /** If set to true, disables the option within the picker that allows users to select a range extending to the current date. */
  disableDateUntilNow?: boolean

  /** If set to true, disables the option for users to select a custom date range. */
  disableCustomRange?: boolean

  /** If set to true, disables the option for selecting relative date ranges, such as "last n days." */
  disableCustomRelative?: boolean

  /** If set to true, disables all selectable options in the component, effectively making it read-only. */
  disableOptions?: boolean

  /** If true, the entire component is disabled, and users cannot interact with it. */
  disabled?: boolean

  /** Sets an initial default value for the picker using a structured object that defines a range of options. */
  defaultValue?: DateRangeOptionsProps

  /** Controls the current value of the picker through a structured object, enabling controlled component behavior. */
  value?: DateRangeOptionsProps

  /** A function that allows for customizing the list of quick selection options based on default options provided. */
  options?: (defaultOptions: DateRangeOptionsProps[]) => DateRangeOptionsProps[] | undefined

  /** A callback function that is fired when the selected value changes, providing the new value as an argument. */
  onChange?: (option: DateRangeOptionsProps | null) => void
}
