import { TimeSeriesQueryProps, useAccessToken, useLog } from '../../components'
import { TimeSeriesQuery, PROPEL_GRAPHQL_API_ENDPOINT, useTimeSeriesQuery, TimeSeriesGranularity } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'

export const useTimeSeries = (props: TimeSeriesQueryProps): UseQueryProps<TimeSeriesQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    metric,
    timeRange,
    granularity,
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

  const { data, error, isInitialLoading } = useTimeSeriesQuery<TimeSeriesQuery, Error>(
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
      timeSeriesInput: {
        metricName: metric,
        timeZone,
        timeRange: {
          relative: timeRange?.relative ?? null,
          n: timeRange?.n ?? null,
          start: timeRange?.start ?? null,
          stop: timeRange?.stop ?? null
        },
        granularity: granularity as TimeSeriesGranularity,
        filters: filters
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
