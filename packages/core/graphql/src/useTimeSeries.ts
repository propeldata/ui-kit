import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import {
  FilterInput,
  Propeller,
  TimeRangeInput,
  TimeSeriesDocument,
  TimeSeriesGranularity,
  TimeSeriesQuery,
  TimeSeriesQueryVariables
} from './generated'
import { PROPEL_GRAPHQL_API_ENDPOINT } from '.'

interface Query {
  /** This should eventually be replaced to customer's app credentials */
  accessToken?: string
  /** Metric unique name */
  metric?: string
  /** Time range that the chart will respond to */
  timeRange?: TimeRangeInput
  /** Granularity that the chart will respond to */
  granularity: TimeSeriesGranularity
  /** Filters that the chart will respond to */
  filters?: FilterInput[]
  /** Propeller that the chart will respond to */
  propeller?: Propeller
  /** Timestamp format that the chart will respond to */
  timestampFormat?: string
  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number
}

interface Options {
  /** Whether the query is enabled or not */
  enabled?: boolean
}

export function useTimeSeries(query?: Query, options?: Options) {
  const fetcher = () =>
    query &&
    request<TimeSeriesQuery, TimeSeriesQueryVariables>(
      PROPEL_GRAPHQL_API_ENDPOINT,
      TimeSeriesDocument,
      {
        timeSeriesInput: {
          metricName: query.metric,
          timeRange: {
            relative: query.timeRange?.relative ?? null,
            n: query.timeRange?.n ?? null,
            start: query.timeRange?.start ?? null,
            stop: query.timeRange?.stop ?? null
          },
          granularity: query.granularity,
          filters: query.filters,
          propeller: query.propeller
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

  const labels = data?.timeSeries?.labels
  const values = (data?.timeSeries?.values ?? []).map((value) => (value == null ? null : Number(value)))

  const isLoading = options?.enabled ? isLoadingQuery : false

  return { labels, values, isLoading, error }
}
