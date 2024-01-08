import type { ChartConfiguration } from 'chart.js'
import { DimensionInput, Sort } from 'src/helpers'
import { ErrorFallbackProps } from '../ErrorFallback'
import { DataComponentProps, QueryProps } from '../shared.types'

type PieChartVariant = 'pie' | 'doughnut'

export type ChartProps = {
  /** Sets the position of the labels */
  labelPosition?: 'axis' | 'inside' | 'top'

  /** Sets the other label text
   * @default Other
   */
  otherLabel?: string

  /** Hides the legend on chart if it is set the true
   * @default false
   */
  hideLegend?: boolean

  /** Sets the position of the legend
   * @default top
   */
  legendPosition?: 'top' | 'bottom'

  /** Sets the chart color platte */
  chartColorPlatte?: string[]
}

export type PieChartData = {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export interface PieChartQueryProps extends QueryProps {
  /** The number of rows to be returned. It can be a number between 1 and 1,000 */
  rowLimit?: number

  /** The sort order of the rows. It can be ascending (ASC) or descending (DESC) order. Defaults to descending (DESC) order when not provided. */
  sort?: Sort

  /** The variant the chart will display, can be either "pie" or "doughnut" */
  dimensions?: DimensionInput[]
}

export interface PieChartProps extends ErrorFallbackProps, DataComponentProps {
  /** The variant the chart will respond to, can be either `pie` or `doughnut` */
  variant?: PieChartVariant

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** If passed along with `rows` the component will ignore the built-in GraphQL operations */
  headers?: string[]

  /** If passed along with `headers` the component will ignore the built-in GraphQL operations */
  rows?: string[][]

  /** PieChart query props */
  query?: PieChartQueryProps

  /** Optional props that are used to configure the chart component.  */
  chartProps?: ChartProps

  /** An optional prop that provides access to the Chart.js API, allowing for further customization of chart settings. */
  chartConfigProps?: (config: ChartConfiguration<'pie' | 'doughnut'>) => ChartConfiguration<'pie' | 'doughnut'>
}
