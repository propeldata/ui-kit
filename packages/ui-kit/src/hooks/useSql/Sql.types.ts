import { QueryProps } from '../../components/shared.types'

/**
 * @interface SqlQueryProps
 * @description Interface to query sql data using Propel's GraphQL API.
 * @property {string} query - SQL query string
 * @property {string} accessToken - Access token used for the query.
 * @property {number} refetchInterval - Interval in milliseconds for refetching the data
 * @property {boolean} retry - Whether to retry on errors.
 * @property {boolean} enabled - Whether to enable or not.
 * @property {string} propelApiUrl - To override the URL for Propel's GraphQL API.
 */
export interface SqlQueryProps
  extends Pick<QueryProps, 'accessToken' | 'refetchInterval' | 'retry' | 'enabled' | 'propelApiUrl'> {
  /** The SQL query. */
  query: string
}
