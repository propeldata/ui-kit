import { CounterQueryProps, useAccessToken, useLog } from '../../components'
import { CounterQuery, getTimeZone, PROPEL_GRAPHQL_API_ENDPOINT, useCounterQuery } from '../../helpers'

interface useCounterProps {
  query?: CounterQueryProps
  timeZone?: string
}

export const useCounter = (props?: useCounterProps) => {
  const { query, timeZone } = props

  const log = useLog()

  const { accessToken: accessTokenFromProvider, isLoading: isLoadingAccessToken } = useAccessToken()

  const accessToken = query?.accessToken ?? accessTokenFromProvider

  if (query && accessToken == null) {
    log.error('No access token provided')
  }

  const { data, isInitialLoading, error } = useCounterQuery<CounterQuery, Error>(
    {
      endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/graphql-response+json',
          authorization: `Bearer ${accessToken}`
        }
      }
    },
    {
      counterInput: {
        metricName: query?.metric,
        timeZone: timeZone ?? getTimeZone(),
        timeRange: {
          relative: query?.timeRange?.relative ?? null,
          n: query?.timeRange?.n ?? null,
          start: query?.timeRange?.start ?? null,
          stop: query?.timeRange?.stop ?? null
        },
        filters: query?.filters ?? []
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: query && accessToken != null
    }
  )

  return {
    value: data?.counter?.value,
    isLoadingQuery: isInitialLoading ?? isLoadingAccessToken,
    error
  }
}
