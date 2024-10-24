import { ComponentPropsWithoutRef } from 'react'

import { AccentColors, ThemeSettingProps } from '../../themes'
import type { ChartQueryProps, DataComponentProps, PaginationProps } from '../../components/shared.types'
import type { DataPoolInput, Sort } from '../../graphql'
import { ButtonProps } from '../Button'
import { OptionValue, SelectProps } from '../Select'

export type DataGridData = {
  headers?: string[] | null
  rows?: (string | null)[][]
}

export interface DataGridQueryProps extends Omit<ChartQueryProps, 'metric'>, PaginationProps {
  /** The columns to retrieve, if not passed, all columns will be included, Pass ['*'] to retrieve all columns */
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

interface SlotProps {
  /** Props to be applied to the `footer` element */
  footer?: ComponentPropsWithoutRef<'div'>
  /** Props to be applied to the `table` element */
  table?: ComponentPropsWithoutRef<'div'>
  /** Props to be applied to the `cell` element */
  cell?: ComponentPropsWithoutRef<'div'>
  /** Props to be applied to the `button` element */
  button?: ButtonProps
  /** Props to be applied to the `select` element */
  select?: SelectProps<OptionValue>
  /** Props to be applied to the `header` element */
  header?: ComponentPropsWithoutRef<'div'>
}

export interface DataGridProps extends DataComponentProps<'div'>, ThemeSettingProps {
  /** DataGrid query props */
  query?: DataGridQueryProps
  /** If true, the table columns will be resizable */
  resizable?: boolean
  /** If passed along with `rows` the component will ignore the built-in GraphQL operations */
  headers?: string[]
  /** If passed along with `headers` the component will ignore the built-in GraphQL operations */
  rows?: (string | null)[][]
  /** When true, shows a skeleton loader */
  loading?: boolean
  /** Props that will affect pagination */
  paginationProps?: DataGridPaginationProps
  /** If true, the pagination footer will be hidden */
  disablePagination?: boolean
  /** Determines how the table lines are shown, defaults to "both" */
  tableLinesLayout?: 'vertical' | 'horizontal' | 'both' | 'none'
  /** @deprecated This type is deprecated, use `errorFallbackProps` and `errorFallback` instead */
  error?: {
    title: string
    body: string
  } | null
  slotProps?: SlotProps
  /** If true, the table border will be hidden */
  hideBorder?: boolean
  /** The color of the table border */
  borderColor?: AccentColors | string
  /** The color of the grid lines */
  gridLineColor?: AccentColors | string
  /**
   * The global theme accent color. This color is used to highlight elements
   */
  accentColor?: AccentColors
  /** If true, the headers will be prettified */
  prettifyHeaders?: boolean
  /** If true, row count will be shown in the footer */
  showRowCount?: boolean
}

interface DataGridPaginationProps {
  /** Default page size for uncontrolled pagination, if passed, query controlled pagination props will be ignored */
  defaultPageSize?: number
  /** Options that will populate the pagination select, if not passed, default options will be used (10, 50, 100) */
  pageSizeOptions?: number[]
}
