import { useAccessToken, useLog } from '../../components'
import { TopValuesQuery, PROPEL_GRAPHQL_API_ENDPOINT, useTopValuesQuery } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'
import { TopValuesQueryProps } from '../../components/TopValues/TopValues.types'

/**
 * This hook allows you to query Top Values using Propel's GraphQL API.
 * Use it to build custom components that require Top Values data.
 * @hook useTopValues
 * @param props
 * @returns {data: TopValuesQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useTopValues = ({
  accessToken: accessTokenFromProp,
  propelApiUrl,
  metric,
  timeRange,
  columnName,
  dataPool,
  maxValues,
  refetchInterval,
  retry,
  enabled: enabledProp = true,
  timeZone
}: TopValuesQueryProps): UseQueryProps<TopValuesQuery> => {
  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null && enabledProp

  // Log error if no access token provided and metric is provided
  if (accessToken == null && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  const dataPoolInput = dataPool?.name != null ? { name: dataPool.name } : { id: dataPool?.id ?? '' }

  const withTimeRange = timeRange != null ? { timeRange: { ...timeRange } } : {}

  /**
   * @hook react-query wrapper
   * @param {TopValuesQuery} data
   * @returns {data: TopValuesQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading } = useTopValuesQuery<TopValuesQuery, Error>(
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
      topValuesInput: {
        columnName: columnName ?? '',
        dataPool: dataPoolInput,
        maxValues,
        ...withTimeRange,
        timeZone
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
