import type { TimeRangeInput } from '../../graphql'
import { ThemeSettingProps } from '../../themes'
import type { ButtonProps } from '../Button'

export interface DateRangeOptionsProps {
  /** A unique identifier for the date range option, used to distinguish between different options. */
  value: string

  /** A human-readable label that describes the date range option. */
  label?: string

  /** The value of the date range option, which can be either a specific date range or a relative time range. */
  params?: TimeRangeInput
}

export interface TimeRangePickerProps
  extends ThemeSettingProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'size'>,
    Pick<ButtonProps, 'size'> {
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

  /** The locale used to format the date and time values, e.g. "en-US". */
  locale?: string

  /** A function that allows for customizing the list of quick selection options based on default options provided. */
  options?: (defaultOptions: DateRangeOptionsProps[]) => DateRangeOptionsProps[] | undefined

  /** A callback function that is fired when the selected value changes, providing the new value as an argument. */
  onChange?: (option: DateRangeOptionsProps) => void

  /** If true, the select is open by default. */
  defaultOpen?: boolean
}
