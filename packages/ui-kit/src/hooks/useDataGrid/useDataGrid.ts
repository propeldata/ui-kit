import { useAccessToken, useLog } from '../../components'
import { DataGridQuery, useDataGridQuery, PROPEL_GRAPHQL_API_ENDPOINT, Sort } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'
import { DataGridQueryProps } from '../../components/DataGrid/DataGrid.types'

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
  timeRange,
  timeZone,
  columns,
  filters,
  dataPool,
  orderByColumn,
  sort = Sort.Desc,
  first = 50,
  last = 50,
  after,
  before,
  refetchInterval,
  retry
}: DataGridQueryProps): UseQueryProps<DataGridQuery> => {
  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null

  // Log error if no access token provided and dataPool is provided
  if (!enabled && dataPool != null) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  const dataPoolInput = dataPool?.name != null ? { name: dataPool.name } : { id: dataPool?.id ?? '' }

  /**
   * @hook react-query wrapper
   * @param {DataGridQuery} data
   * @returns {data: DataGridQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading } = useDataGridQuery<DataGridQuery, Error>(
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
        timeRange: {
          relative: timeRange?.relative ?? null,
          n: timeRange?.n ?? null,
          start: timeRange?.start ?? null,
          stop: timeRange?.stop ?? null
        },
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
    isLoading: isInitialLoading ?? isLoadingAccessToken,
    error: enabled ? error : accessTokenError
  }
}