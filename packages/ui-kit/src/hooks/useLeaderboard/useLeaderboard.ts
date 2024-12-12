import { useMemo } from 'react'
import { LeaderboardQueryProps } from '../../components/Leaderboard/Leaderboard.types'
import {
  CounterQuery,
  LeaderboardQuery,
  PROPEL_GRAPHQL_API_ENDPOINT,
  TimeRangeInput,
  useCounterQuery,
  useLeaderboardQuery
} from '../../graphql'
import { getTimeZone } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'
import { useAccessToken } from './../../components/AccessTokenProvider/useAccessToken'
import { useFilters } from './../../components/FilterProvider/useFilters'
import { useLog } from './../../components/Log/useLog'
import { patchMetricInputDataPool } from '@/helpers/patchMetricInputDataPool'
import { MetricInput } from '@/graphql/generated'

/**
 * This hook allows you to query a Leaderboard using Propel's GraphQL API.
 * Use it to build custom components that require Leaderboard data.
 * @hook useLeaderboard
 * @param props
 * @returns {data: LeaderboardQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useLeaderboard = (props: LeaderboardQueryProps): UseQueryProps<LeaderboardQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    metric: metricProp,
    sort,
    rowLimit,
    dimensions,
    timeRange: timeRangeProp,
    filters: filtersFromProp,
    filterSql: filterSqlFromProp,
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

  const {
    filters: filtersFromProvider,
    timeRange: timeRangeFromProvider,
    dataPool: defaultDataPool,
    filterSql: filterSqlFromProvider
  } = useFilters()

  const filterSql = filterSqlFromProp ?? filterSqlFromProvider

  // Only use filters if filterSql is not provided
  const filters = filterSql == null ? filtersFromProp ?? filtersFromProvider : []

  const timeRange =
    timeRangeFromProvider != null || timeRangeProp != null
      ? { ...(timeRangeFromProvider ?? {}), ...(timeRangeProp ?? {}) }
      : null

  const metric = patchMetricInputDataPool(metricProp, defaultDataPool)

  const enabled = accessToken != null && enabledProp

  const isNoDimensions = dimensions == null || dimensions.length === 0

  // Log error if no access token provided and metric is provided
  if (accessToken == null && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  // Define metric input
  const metricInput = typeof metric === 'string' ? { metricName: metric } : { metric: metric as MetricInput }

  const withTimeRange: Partial<{ timeRange: TimeRangeInput }> = timeRange != null ? { timeRange: { ...timeRange } } : {}
  const withFilters = filters.length > 0 ? { filters } : {}

  const leaderboardEnabled = enabled && !isNoDimensions

  /**
   * @hook react-query wrapper
   * @param {LeaderboardQuery} data
   * @returns {data: LeaderboardQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const {
    data: leaderboardData,
    error,
    isInitialLoading,
    isLoading
  } = useLeaderboardQuery<LeaderboardQuery, Error>(
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
      leaderboardInput: {
        ...metricInput,
        sort: sort,
        rowLimit: rowLimit ?? 100,
        dimensions: dimensions ?? [],
        timeZone: getTimeZone(timeZone),
        ...withTimeRange,
        ...withFilters,
        filterSql
      }
    },
    {
      refetchInterval,
      retry,
      enabled: leaderboardEnabled
    }
  )

  const counterEnabled = enabled && props.enabled && isNoDimensions

  const {
    data: counterData,
    isLoading: isCounterLoading,
    error: counterError
  } = useCounterQuery<CounterQuery, Error>(
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
        ...withFilters,
        filterSql
      }
    },
    { enabled: counterEnabled, refetchInterval, retry }
  )

  const data = useMemo(() => {
    return isNoDimensions
      ? { leaderboard: { headers: ['', 'value'], rows: [['All', counterData?.counter?.value ?? null]] } }
      : leaderboardData
  }, [isNoDimensions, leaderboardData, counterData])

  return {
    data,
    isLoading:
      ((isInitialLoading && leaderboardEnabled) ||
        (isCounterLoading && counterEnabled) ||
        (isLoading && leaderboardEnabled && enabledProp)) ??
      isLoadingAccessToken,
    error: (leaderboardEnabled && error) || (counterEnabled && counterError) || accessTokenError
  }
}
