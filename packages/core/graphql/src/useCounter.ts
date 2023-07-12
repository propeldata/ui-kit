import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import {
  CounterDocument,
  CounterQuery,
  CounterQueryVariables,
  FilterInput,
  Propeller,
  TimeRangeInput
} from './generated'
import { PROPEL_GRAPHQL_API_ENDPOINT } from '.'

interface Query {
  /** Time range that the chart will respond to. Will be ignored when value is passed */
  timeRange?: TimeRangeInput
  /** This should eventually be replaced to customer's app credentials. Will be ignored when value is passed */
  accessToken?: string
  /** Metric unique name will be ignored when value is passed */
  metric?: string
  /** Filters that the chart will respond to */
  filters?: FilterInput[]
  /** Propeller that the chart will respond to */
  propeller?: Propeller
  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number
}

interface Options {
  /** Whether the query is enabled or not */
  enabled?: boolean
}

export function useCounter(query?: Query, options?: Options) {
  const fetcher = () =>
    request<CounterQuery, CounterQueryVariables>(
      PROPEL_GRAPHQL_API_ENDPOINT,
      CounterDocument,
      {
        counterInput: {
          metricName: query?.metric,
          timeRange: {
            relative: query?.timeRange?.relative ?? null,
            n: query?.timeRange?.n ?? null,
            start: query?.timeRange?.start ?? null,
            stop: query?.timeRange?.stop ?? null
          },
          filters: query?.filters,
          propeller: query?.propeller
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

  const value = data?.counter?.value
  const isLoading = options?.enabled ? isLoadingQuery : false

  return { value, isLoading, error }
}
