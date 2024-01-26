import { CounterQueryProps, useAccessToken, useFilters, useLog } from '../../components'
import { CounterQuery, getTimeZone, PROPEL_GRAPHQL_API_ENDPOINT, useCounterQuery } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'

/**
 * This hook allows you to query a Counter using Propel's GraphQL API.
 * Use it to build custom components that require Counter data.
 * @hook useCounter
 * @param props
 * @returns {data: CounterQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useCounter = (props: CounterQueryProps): UseQueryProps<CounterQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    metric,
    timeRange,
    filters: filtersFromProp,
    refetchInterval,
    retry,
    enabled: enabledProp = true,
    timeZone
  } = props

  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const { filters: filtersFromProvider } = useFilters()

  const filters = filtersFromProp ?? filtersFromProvider

  const enabled = accessToken != null && enabledProp

  // Log error if no access token provided and metric is provided
  if (!enabled && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  // Define metric input
  const metricInput = typeof metric === 'string' ? { metricName: metric } : { metric: metric }

  const withTimeRange = timeRange != null ? { ...timeRange } : {}

  /**
   * @hook react-query wrapper
   * @param {CounterQuery} data
   * @returns {data: CounterQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading } = useCounterQuery<CounterQuery, Error>(
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
      counterInput: {
        ...metricInput,
        timeZone: timeZone ?? getTimeZone(),
        ...withTimeRange,
        filters
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
