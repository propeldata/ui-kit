import type { ChartQueryProps } from '../../components/shared.types'
import type { DataPoolInput, Sort } from '../../graphql'

export interface DataGridQueryProps extends Omit<ChartQueryProps, 'metric'> {
  /** The columns to retrieve. */
  columns?: string[]

  /**
   * The Data Pool to be queried. A Data Pool ID or unique name can be provided
   * @type DataPoolInput
   * */
  dataPool?: DataPoolInput

  /** The index of the column to order the table by. The index is 1-based. If not provided, records will be ordered by their timestamp by default. */
  orderByColumn?: number

  /**
   * The sort order of the rows. It can be ascending (`ASC`) or descending (`DESC`) order. Defaults to descending (`DESC`) order when not provided.
   * @type 'ASC' | 'DESC'
   * @default 'DESC'
   * */
  sort?: Sort

  /**
   * The number of rows to be returned when paging forward. It can be a number between 1 and 1,000.
   * @default 50
   * */
  first?: number

  /**
   * The number of rows to be returned when paging forward. It can be a number between 1 and 1,000.
   * @default 50
   * */
  last?: number

  /** The cursor to use when paging forward. */
  after?: string

  /** The cursor to use when paging backward. */
  before?: string
}
