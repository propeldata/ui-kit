import {
  PROPEL_GRAPHQL_API_ENDPOINT,
  TimeRangeInput,
  TimeSeriesGranularity,
  TimeSeriesQuery,
  useTimeSeriesQuery
} from '../../graphql'
import { UseQueryProps } from '../types/Query.types'
import { useAccessToken } from './../../components/AccessTokenProvider/useAccessToken'
import { useFilters } from './../../components/FilterProvider/useFilters'
import { useLog } from './../../components/Log/useLog'
import { TimeSeriesQueryProps } from './../../components/TimeSeries/TimeSeries.types'
import { patchMetricInputDataPool } from '@/helpers/patchMetricInputDataPool'
import { MetricInput } from '@/graphql/generated'

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
    metric: metricProp,
    timeRange: timeRangeProp,
    granularity: granularityProp,
    filters: filtersFromProp,
    refetchInterval,
    enabled: enabledProp = true,
    retry,
    timeZone,
    groupBy
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

  const {
    filters: filtersFromProvider,
    timeRange: timeRangeFromProvider,
    granularity: granularityFromProvider,
    dataPool: defaultDataPool
  } = useFilters()

  const filters = filtersFromProp ?? filtersFromProvider

  const timeRange =
    timeRangeFromProvider != null || timeRangeProp != null
      ? { ...(timeRangeFromProvider ?? {}), ...(timeRangeProp ?? {}) }
      : null

  const metric = patchMetricInputDataPool(metricProp, defaultDataPool)

  const granularity = granularityProp ?? granularityFromProvider

  const enabled = accessToken != null && enabledProp

  // Log error if no access token provided and metric is provided
  if (!enabled && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  // Define metric input
  const metricInput = typeof metric === 'string' ? { metricName: metric } : { metric: metric as MetricInput }

  const withTimeRange: Partial<{ timeRange: TimeRangeInput }> = timeRange != null ? { timeRange: { ...timeRange } } : {}
  const withGroupBy: Partial<{ groupBy: string[] }> = groupBy != null ? { groupBy } : {}

  /**
   * @hook react-query wrapper
   * @param {TimeSeriesQuery} data
   * @returns {data: TimeSeriesQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading, isLoading } = useTimeSeriesQuery<TimeSeriesQuery, Error>(
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
        ...metricInput,
        timeZone,
        ...withTimeRange,
        granularity: granularity as TimeSeriesGranularity,
        filters,
        ...withGroupBy
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
