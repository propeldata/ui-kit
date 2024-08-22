import { useFilters } from '../../components/FilterProvider/useFilters'
import { DataGridQueryProps } from '../../components/DataGrid/DataGrid.types'
import { DataGridQuery, PROPEL_GRAPHQL_API_ENDPOINT, Sort, TimeRangeInput, useDataGridQuery } from '../../graphql'
import { UseQueryProps } from '../types/Query.types'
import { useAccessToken } from './../../components/AccessTokenProvider/useAccessToken'
import { useLog } from './../../components/Log/useLog'

/**
 * This hook allows you to query Data Grid using Propel's GraphQL API.
 * Use it to build custom components that require Data Grid data.
 * @hook useDataGrid
 * @param props
 * @returns {data: DataGridQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useDataGrid = ({
  accessToken: accessTokenFromProp,
  propelApiUrl,
  timeRange: timeRangeProp,
  timeZone,
  columns,
  filters: filtersProp,
  dataPool,
  orderByColumn,
  sort = Sort.Desc,
  first = 50,
  last = 50,
  after,
  before,
  refetchInterval,
  enabled: enabledProp = true,
  retry
}: DataGridQueryProps): UseQueryProps<DataGridQuery> => {
  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  const { filters: filtersFromProvider, timeRange: timeRangeFromProvider } = useFilters()

  const timeRange = timeRangeProp ?? timeRangeFromProvider?.params
  const filters = filtersProp ?? filtersFromProvider

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null && enabledProp

  // Log error if no access token provided and dataPool is provided
  if (accessToken == null && dataPool != null) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  const withTimeRange: Partial<{ timeRange: TimeRangeInput }> = timeRange != null ? { timeRange: { ...timeRange } } : {}

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
        columns: columns ?? [],
        dataPool: dataPoolInput,
        filters: filters ?? [],
        ...withTimeRange,
        timeZone,
        orderByColumn,
        sort,
        first,
        last,
        after,
        before
      }
    },
    {
      refetchInterval,
      retry,
      enabled
    }
  )

  return {
    data,
    isLoading: (isInitialLoading || (isLoading && enabledProp)) ?? isLoadingAccessToken,
    error: enabled ? error : accessTokenError
  }
}
