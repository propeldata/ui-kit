import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetcher } from "../fetcher";
import { CounterDocument, CounterQuery, CounterQueryVariables } from "../generated";

export const useCounterQuery = <
      TData = CounterQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: CounterQueryVariables,
      options?: UseQueryOptions<CounterQuery, TError, TData>
    ) => {

    return useQuery<CounterQuery, TError, TData>(
      ['Counter', dataSource, variables],
      fetcher<CounterQuery, CounterQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CounterDocument, variables),
      options
    )};
