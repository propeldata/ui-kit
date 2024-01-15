import { TimeSeriesQueryProps, useAccessToken, useLog, useFilter } from '../../components'
import { TimeSeriesQuery, PROPEL_GRAPHQL_API_ENDPOINT, useTimeSeriesQuery, TimeSeriesGranularity } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'

/**
 * This hook allows you to query a Time Series using Propel's GraphQL API.
 * Use it to build custom components that require Time Series data.
 * @hook useTimeSeries
 * @param props
 * @returns {data: TimeSeriesQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useTimeSeries = (props: TimeSeriesQueryProps): UseQueryProps<TimeSeriesQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    metric,
    timeRange,
    granularity,
    filters: filtersFromProp,
    refetchInterval,
    retry,
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

  const { filters: filtersFromProvider } = useFilter()

  const filters = filtersFromProp ?? filtersFromProvider

  const enabled = accessToken != null

  // Log error if no access token provided and metric is provided
  if (!enabled && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  /**
   * @hook react-query wrapper
   * @param {TimeSeriesQuery} data
   * @returns {data: TimeSeriesQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
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
