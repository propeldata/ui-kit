import { CounterQueryProps, useAccessToken, useLog } from '../../components'
import { CounterQuery, getTimeZone, PROPEL_GRAPHQL_API_ENDPOINT, useCounterQuery } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'

export const useCounter = (props?: CounterQueryProps): UseQueryProps<CounterQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    metric,
    timeRange,
    filters,
    refetchInterval,
    retry,
    timeZone
  } = props

  const log = useLog()

  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  if (!accessToken && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

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
      refetchInterval: refetchInterval,
      retry: retry,
      enabled: accessToken != null
    }
  )

  return {
    data,
    isLoading: isInitialLoading ?? isLoadingAccessToken,
    error: accessTokenError ?? error
  }
}
