import { DataPoolInput } from '../../helpers'
import { SelectProps } from '../Select/Select.types'
import { DataComponentProps, DropdownOption, QueryProps } from '../shared.types'

export interface MultiSelectFilterQueryProps extends Omit<QueryProps, 'metric' | 'filters'> {
  /** The column to fetch the unique values from */
  columnName?: string

  /** The Data Pool to be queried. A Data Pool ID or unique name can be provided */
  dataPool?: DataPoolInput

  /** The maximum number of values to return. It can be a number between 1 and 1,000. If the parameter is omitted, default value 10 is used */
  maxValues?: number
}

export interface MultiSelectFilterProps extends Omit<DataComponentProps, 'card'> {
  /** The possible values for the selected column, will be ignored if `query` is passed */
  options?: DropdownOption[] | string[]

  /** The name of the column to which the filter will be applied, will be ignored if `query` is passed */
  columnName?: string

  /** Props to be applied to the `Select` component */
  selectProps?: Omit<SelectProps, 'multiple' | 'onChange'>

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** SimpleFilter query props */
  query?: MultiSelectFilterQueryProps

  /** Whether there was an error or not, setting to `true` will enable freeSolo mode */
  error?: boolean
}
