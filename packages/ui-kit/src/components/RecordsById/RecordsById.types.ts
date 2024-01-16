import type { QueryProps } from 'src/components/shared.types'

export interface RecordsByIdQueryProps
  extends Partial<Pick<QueryProps, 'accessToken' | 'refetchInterval' | 'retry' | 'propelApiUrl'>> {
  /** The Data Pool to be queried. If a Data Pool ID is provided it will take precedence over the Data Pool name. */
  dataPoolId?: string

  /** The Data Pool to be queried. If a Data Pool ID is provided it will take precedence over the Data Pool name. */
  dataPoolName?: string

  /** The columns to retrieve. */
  columns: string[]

  /** The unique IDs of the records to retrieve.  */
  uniqueIds: string[]
}
