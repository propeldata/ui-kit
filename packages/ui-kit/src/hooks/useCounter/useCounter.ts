import { CounterQueryProps } from '../../components/Counter/Counter.types'
import { CounterQuery, PROPEL_GRAPHQL_API_ENDPOINT, TimeRangeInput, useCounterQuery } from '../../graphql'
import { getTimeZone } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'
import { useAccessToken } from './../../components/AccessTokenProvider/useAccessToken'
import { useFilters } from './../../components/FilterProvider/useFilters'
import { useLog } from './../../components/Log/useLog'

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
    timeRange: timeRangeProp,
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

  const { filters: filtersFromProvider, timeRange: timeRangeFromProvider } = useFilters()

  const filters = filtersFromProp ?? filtersFromProvider

  const timeRange = timeRangeProp ?? timeRangeFromProvider?.params

  const enabled = accessToken != null && enabledProp

  // Log error if no access token provided and metric is provided
  if (!enabled && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  // Define metric input
  const metricInput = typeof metric === 'string' ? { metricName: metric } : { metric: metric }

  const withTimeRange: Partial<{ timeRange: TimeRangeInput }> = timeRange != null ? { timeRange: { ...timeRange } } : {}

  /**
   * @hook react-query wrapper
   * @param {CounterQuery} data
   * @returns {data: CounterQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading, isLoading } = useCounterQuery<CounterQuery, Error>(
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
        timeZone: getTimeZone(timeZone),
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
    isLoading: (isInitialLoading || (isLoading && enabledProp)) ?? isLoadingAccessToken,
    error: enabled ? error : accessTokenError
  }
}
