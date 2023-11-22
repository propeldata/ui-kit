import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetcher } from "../fetcher";
import { TimeSeriesDocument, TimeSeriesQuery, TimeSeriesQueryVariables } from "../generated";

export const useTimeSeriesQuery = <
      TData = TimeSeriesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: TimeSeriesQueryVariables,
      options?: UseQueryOptions<TimeSeriesQuery, TError, TData>
    ) => {

    return useQuery<TimeSeriesQuery, TError, TData>(
      ['TimeSeries', dataSource, variables],
      fetcher<TimeSeriesQuery, TimeSeriesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, TimeSeriesDocument, variables),
      options
    )};
