import React from 'react'

import type { DataComponentProps, PaginationProps, QueryProps } from '../../components/shared.types'
import type { DataPoolInput, Sort } from '../../helpers'

export type DataGridData = {
  headers?: string[]
  rows?: Array<string | null>
}

export interface DataGridQueryProps extends Omit<QueryProps, 'metric'>, PaginationProps {
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
}

export interface RowProps {
  styles: CSSStyleSheet
}

type RowCallbackArguments = { props: RowProps; RowComponent: React.ReactElement; CellComponent: React.ReactElement }

export interface DataGridProps extends DataComponentProps<'div'> {
  rowOverride?: React.ReactElement | ((args: RowCallbackArguments) => React.ReactElement)
  query?: DataGridQueryProps
  resizable?: boolean
  /** Props to be applied to the `table` element */
  tableProps?: React.HTMLAttributes<HTMLTableElement>
  /** Props to be applied to the `td` elements */
  cellProps?: React.HTMLAttributes<HTMLTableCellElement>
  /** Default page size for uncontrolled pagination, if passed, query controlled pagination props will be ignored */
  defaultPageSize?: number
  /** If passed along with `rows` the component will ignore the built-in GraphQL operations */
  headers?: string[]
  /** If passed along with `headers` the component will ignore the built-in GraphQL operations */
  rows?: (string | null)[][]
}
