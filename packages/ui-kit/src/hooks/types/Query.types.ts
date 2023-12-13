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
  data?: T

  /**
   * Indicates if the query is loading
   * Sets to true when the query is fetching data for the first time and when the access token is loading
   */
  isLoading?: boolean

  /**
   * Throws error
   * @name AccessTokenError When accessToken is not provided
   * @name Error When the query fails
   */
  error?: Error
}
