import { useFilters } from '../../components/FilterProvider/useFilters'
import { DataGridQueryProps } from '../../components/DataGrid/DataGrid.types'
import { DataGridQuery, PROPEL_GRAPHQL_API_ENDPOINT, Sort, TimeRangeInput, useDataGridQuery } from '../../graphql'
import { UseQueryProps } from '../types/Query.types'
import { useAccessToken } from './../../components/AccessTokenProvider/useAccessToken'
import { useLog } from './../../components/Log/useLog'
import { useEffect, useState } from 'react'
import { useDataPoolColumns } from '../useDataPoolColumns'

/**
 * This hook allows you to query Data Grid using Propel's GraphQL API.
 * Use it to build custom components that require Data Grid data.
 * @hook useDataGrid
 * @param props
 * @returns {data: DataGridQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useDataGrid = (props: DataGridQueryProps): UseQueryProps<DataGridQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    timeRange: timeRangeProp,
    timeZone,
    columns,
    filters: filtersFromProp,
    filterSql: filterSqlFromProp,
    dataPool: dataPoolProp,
    orderByColumn,
    sort = Sort.Desc,
    first = 50,
    last = 50,
    after,
    before,
    refetchInterval,
    enabled: enabledProp = true,
    retry
  } = props

  const [fetchedColumns, setFetchedColumns] = useState<string[] | null>(null)

  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  const {
    filters: filtersFromProvider,
    timeRange: timeRangeFromProvider,
    dataPool: dataPoolFromProvider,
    filterSql: filterSqlFromProvider
  } = useFilters()

  const dataPool = dataPoolProp ?? dataPoolFromProvider

  const isAllColumns = columns?.includes('*')

  const timeRange =
    timeRangeFromProvider != null || timeRangeProp != null
      ? { ...(timeRangeFromProvider ?? {}), ...(timeRangeProp ?? {}) }
      : null

  const filterSql = filterSqlFromProp ?? filterSqlFromProvider

  // Only use filters if filterSql is not provided
  const filters = filterSql == null ? filtersFromProp ?? filtersFromProvider : []

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null && (!isAllColumns || fetchedColumns != null) && enabledProp

  // Log error if no access token provided and dataPool is provided
  if (accessToken == null && dataPool != null) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  const withTimeRange: Partial<{ timeRange: TimeRangeInput }> = timeRange != null ? { timeRange: { ...timeRange } } : {}
  const withFilters = filters.length > 0 ? { filters } : {}

  const dataPoolInput = dataPool?.name != null ? { name: dataPool.name } : { id: dataPool?.id ?? '' }

  /**
   * @hook react-query wrapper
   * @param {DataGridQuery} data
   * @returns {data: DataGridQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading, isLoading } = useDataGridQuery<DataGridQuery, Error>(
    {
      endpoint: propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/graphql-response+json',
          authorization: `Bearer ${accessToken}`
        }
      }
    },
    {
      dataGridInput: {
        columns: isAllColumns ? fetchedColumns ?? [] : columns ?? [],
        dataPool: dataPoolInput,
        ...withFilters,
        ...withTimeRange,
        timeZone,
        orderByColumn,
        sort,
        first,
        last,
        after,
        before,
        filterSql
      }
    },
    {
      refetchInterval,
      retry,
      enabled
    }
  )

  const { columns: fetchedColumnsData, isLoading: isLoadingFetchedColumns } = useDataPoolColumns({ ...props })

  useEffect(() => {
    if (fetchedColumnsData) {
      setFetchedColumns(fetchedColumnsData.map(({ columnName }) => columnName))
    }
  }, [fetchedColumnsData])

  return {
    data,
    isLoading:
      (isAllColumns && isLoadingFetchedColumns) ||
      isInitialLoading ||
      (isLoading && enabledProp) ||
      isLoadingAccessToken,
    error: enabled ? error : accessTokenError
  }
}
