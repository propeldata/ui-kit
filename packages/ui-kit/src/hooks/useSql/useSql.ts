import { useAccessToken, useLog } from '../../components'
import { SqlQuery, useSqlQuery, PROPEL_GRAPHQL_API_ENDPOINT } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'
import { SqlQueryProps } from './Sql.types'

/**
 * This hook allows you to query SQL using Propel's GraphQL API.
 * Use it to build custom components that require SQL data.
 * @hook useSql
 * @param props
 * @returns {data: SqlQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useSql = ({
  query,
  accessToken: accessTokenFromProp,
  propelApiUrl,
  refetchInterval,
  retry
}: SqlQueryProps): UseQueryProps<SqlQuery> => {
  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null

  // Log error if no access token provided and metric is provided
  if (!enabled) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  /**
   * @hook react-query wrapper
   * @param {string} query - Sql query
   * @returns {data: SqlQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading } = useSqlQuery<SqlQuery, Error>(
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
      sqlInput: {
        query
      }
    },
    {
      refetchInterval,
      retry,
      enabled
    }
  )

  return {
    data,
    isLoading: isInitialLoading ?? isLoadingAccessToken,
    error: enabled ? error : accessTokenError
  }
}
