import { CounterQueryProps, useAccessToken, useLog } from '../../components'
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
    filters,
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

  const enabled = accessToken != null && enabledProp

  // Log error if no access token provided and metric is provided
  if (!enabled && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

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
        metricName: metric,
        timeZone: timeZone ?? getTimeZone(),
        timeRange: {
          relative: timeRange?.relative ?? null,
          n: timeRange?.n ?? null,
          start: timeRange?.start ?? null,
          stop: timeRange?.stop ?? null
        },
        filters: filters ?? []
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
