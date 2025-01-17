import type { ChartQueryProps } from '../../components/shared.types'
import { DataPoolInput } from '../../graphql'

export interface RecordsByIdQueryProps extends Omit<ChartQueryProps, 'timeZone' | 'timeRange' | 'metric' | 'filters'> {
  /** The Data Pool to be queried. A Data Pool ID or unique name can be provided. */
  dataPool: DataPoolInput

  /** The columns to retrieve. */
  columns: string[]

  /** The unique IDs of the records to retrieve.  */
  uniqueIds: string[]
}
