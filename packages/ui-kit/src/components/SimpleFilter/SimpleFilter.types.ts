import { DataPoolInput } from '../../helpers'
import { AutocompleteProps } from '../Autocomplete/Autocomplete.types'
import { DataComponentProps, QueryProps, DropdownOption } from '../shared.types'

export interface SimpleFilterQueryProps extends Omit<QueryProps, 'metric' | 'filters'> {
  /** The column to fetch the unique values from */
  columnName?: string

  /** The Data Pool to be queried. A Data Pool ID or unique name can be provided */
  dataPool?: DataPoolInput

  /** The maximum number of values to return. It can be a number between 1 and 1,000. If the parameter is omitted, default value 10 is used */
  maxValues?: number
}

export interface SimpleFilterProps extends Omit<DataComponentProps<'span'>, 'card' | 'errorFallback' | 'renderEmpty'> {
  /** Props that the autocomplete input will receive */
  autocompleteProps?: Omit<AutocompleteProps, 'options'>

  /** The possible values for the selected column, will be ignored if `query` is passed */
  options?: DropdownOption[] | string[]

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** The name of the column to which the filter will be applied, will be ignored if `query` is passed */
  columnName?: string

  /** SimpleFilter query props */
  query?: SimpleFilterQueryProps

  /** Whether there was an error or not, setting to `true` will enable freeSolo mode */
  error?: boolean
}
