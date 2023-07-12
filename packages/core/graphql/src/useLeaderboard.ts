import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import {
  DimensionInput,
  FilterInput,
  LeaderboardDocument,
  LeaderboardQuery,
  LeaderboardQueryVariables,
  Propeller,
  Sort,
  TimeRangeInput
} from './generated'
import { PROPEL_GRAPHQL_API_ENDPOINT } from '.'

interface Query {
  /** This should eventually be replaced to customer's app credentials */
  accessToken?: string
  /** Metric unique name */
  metric?: string
  /** Time range that the chart will respond to */
  timeRange?: TimeRangeInput
  /** Filters that the chart will respond to */
  filters?: FilterInput[]
  /** Propeller that the chart will respond to */
  propeller?: Propeller
  /** The number of rows to be returned. It can be a number between 1 and 1,000 */
  rowLimit?: number
  /** The sort order of the rows. It can be ascending (ASC) or descending (DESC) order. Defaults to descending (DESC) order when not provided. */
  sort?: Sort
  /** One or many Dimensions to group the Metric values by. Typically, Dimensions in a leaderboard are what you want to compare and rank. */
  dimensions?: DimensionInput[]
  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number
}

interface Options {
  /** Whether the query is enabled or not */
  enabled?: boolean
}

export function useLeaderboard(query?: Query, options?: Options) {
  const fetcher = () =>
    query &&
    request<LeaderboardQuery, LeaderboardQueryVariables>(
      PROPEL_GRAPHQL_API_ENDPOINT,
      LeaderboardDocument,
      {
        leaderboardInput: {
          metricName: query.metric,
          filters: query.filters,
          propeller: query.propeller,
          sort: query.sort,
          rowLimit: query.rowLimit ?? 100,
          dimensions: query.dimensions ?? [],
          timeRange: {
            relative: query.timeRange?.relative ?? null,
            n: query.timeRange?.n ?? null,
            start: query.timeRange?.start ?? null,
            stop: query.timeRange?.stop ?? null
          }
        }
      },
      {
        authorization: `Bearer ${query?.accessToken}`
      }
    )

  const queryOptions = {
    refetchInterval: query?.refetchInterval,
    enabled: options?.enabled && !!query
  }

  const cacheKey = ['propel-counter', query]

  const { data, isLoading: isLoadingQuery, error } = useQuery(cacheKey, fetcher, queryOptions)

  const headers = data?.leaderboard?.headers
  const rows = data?.leaderboard?.rows

  const isLoading = options?.enabled ? isLoadingQuery : false

  return { headers, rows, isLoading, error }
}
