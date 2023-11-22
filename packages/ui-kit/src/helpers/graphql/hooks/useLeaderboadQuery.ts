import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetcher } from "../fetcher";
import { LeaderboardDocument, LeaderboardQuery, LeaderboardQueryVariables } from "../generated";

export const useLeaderboardQuery = <
      TData = LeaderboardQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: LeaderboardQueryVariables,
      options?: UseQueryOptions<LeaderboardQuery, TError, TData>
    ) => {

    return useQuery<LeaderboardQuery, TError, TData>(
      ['Leaderboard', dataSource, variables],
      fetcher<LeaderboardQuery, LeaderboardQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, LeaderboardDocument, variables),
      options
    )};
