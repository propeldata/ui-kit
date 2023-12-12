/**
 * @interface UseQueryProps
 * @description Query hook interface
 * @property {CounterQuery | LeaderboardQuery | TimeSeriesQuery} data - Query type
 * @property {boolean} isLoadingQuery - Indicates if the query is loading
 * @property {Error} error - Error returned by the query
 * @property {boolean} hasNotAccessToken - Indicates if the access token is not provided
 */
export interface UseQueryProps<T> {
  /** Query type */
  data: T | undefined
  /**
   * Indicates if the query is loading
   * Sets to true when the query is fetching data for the first time and when the access token is loading
   */
  isLoading: boolean
  /** Error returned by the query */
  error: Error | undefined
  /**
   * Indicates if the access token is not provided
   * Sets to true when the access token is not provided by query or provider
   */
  hasNotAccessToken: boolean
}
