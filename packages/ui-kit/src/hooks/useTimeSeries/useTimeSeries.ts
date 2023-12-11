import { TimeSeriesQueryProps, useAccessToken, useLog } from '../../components'
import { TimeSeriesQuery, PROPEL_GRAPHQL_API_ENDPOINT, useTimeSeriesQuery } from '../../helpers'

interface useTimeSeriesProps {
  query?: TimeSeriesQueryProps
  timeZone?: string
}

export const useTimeSeries = (props?: useTimeSeriesProps) => {
  const { query, timeZone } = props

  const log = useLog()

  const { accessToken: accessTokenFromProvider, isLoading: isLoadingAccessToken } = useAccessToken()

  const accessToken = query?.accessToken ?? accessTokenFromProvider

  if (query && !accessToken) {
    log.error('No access token provided.')
  }

  const { data, error, isInitialLoading } = useTimeSeriesQuery<TimeSeriesQuery, Error>(
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
      timeSeriesInput: {
        metricName: query?.metric,
        timeZone,
        timeRange: {
          relative: query?.timeRange?.relative ?? null,
          n: query?.timeRange?.n ?? null,
          start: query?.timeRange?.start ?? null,
          stop: query?.timeRange?.stop ?? null
        },
        granularity: query?.granularity,
        filters: query?.filters
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: query && accessToken != null
    }
  )

  return {
    data,
    isLoadingQuery: isInitialLoading ?? isLoadingAccessToken,
    error,
    hasNotAccessToken: !accessToken
  }
}
