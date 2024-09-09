import { TimeSeriesGranularity } from '../../graphql'
import { ThemeSettingProps } from '../../themes'
import { AutocompleteProps } from '../Autocomplete/Autocomplete.types'
import { DataComponentProps } from '../shared.types'

export interface TimeGrainPickerProps
  extends ThemeSettingProps,
    Omit<DataComponentProps<'span'>, 'card' | 'errorFallback' | 'renderEmpty' | 'renderLoader' | 'loaderProps'> {
  /** Props that the autocomplete input will receive */
  autocompleteProps?: Omit<AutocompleteProps, 'options' | 'disableClearable'>

  /** The possible values for the selected column, will be ignored if `query` is passed */
  options?: TimeSeriesGranularity[]

  /** Whether there was an error or not, setting to `true` will enable freeSolo mode */
  error?: boolean
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
