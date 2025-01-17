import type { ChartQueryProps } from '../../components/shared.types'
import type { DataPoolInput, Maybe } from '../../graphql'

export interface TopValuesQueryProps extends Omit<ChartQueryProps, 'filters'> {
  /** The column to fetch the unique values from */
  columnName?: string

  /** The Data Pool to be queried. A Data Pool ID or unique name can be provided */
  dataPool?: Maybe<DataPoolInput>

  /** The maximum number of values to return. It can be a number between 1 and 1,000. If the parameter is omitted, default value 10 is used */
  maxValues?: number
}
