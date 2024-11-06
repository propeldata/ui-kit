import { TimeSeriesGranularity } from '../../graphql'
import { ThemeSettingProps } from '../../themes'
import { SelectProps } from '../Select'
import { DataComponentProps } from '../shared.types'

export interface TimeGrainPickerProps
  extends ThemeSettingProps,
    Omit<DataComponentProps<'span'>, 'card' | 'errorFallback' | 'renderEmpty' | 'renderLoader' | 'loaderProps'> {
  /** Props that the select input will receive */
  selectProps?: Omit<SelectProps<{ label: string; value: TimeSeriesGranularity }>, 'options' | 'disableClearable'>

  /** The possible values for the selected column, will be ignored if `query` is passed */
  options?: TimeSeriesGranularity[]

  /** Whether there was an error or not, setting to `true` will enable freeSolo mode */
  error?: boolean

  /** If true, the select is open by default. */
  defaultOpen?: boolean
}

export const OrderedTimeSeriesGranularity = [
  TimeSeriesGranularity.Minute,
  TimeSeriesGranularity.FiveMinutes,
  TimeSeriesGranularity.FifteenMinutes,
  TimeSeriesGranularity.Hour,
  TimeSeriesGranularity.Day,
  TimeSeriesGranularity.Week,
  TimeSeriesGranularity.Month,
  TimeSeriesGranularity.Year
]
