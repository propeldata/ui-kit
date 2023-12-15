import { LeaderboardQueryProps, useAccessToken, useLog } from '../../components'
import { LeaderboardQuery, PROPEL_GRAPHQL_API_ENDPOINT, getTimeZone, useLeaderboardQuery } from '../../helpers'
import { UseQueryProps } from '../types/Query.types'

/**
 * @hook useLeaderboard
 * @param props
 * @returns {data: LeaderboardQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useLeaderboard = (props: LeaderboardQueryProps): UseQueryProps<LeaderboardQuery> => {
  const {
    accessToken: accessTokenFromProp,
    propelApiUrl,
    metric,
    sort,
    rowLimit,
    dimensions,
    timeRange,
    filters,
    refetchInterval,
    retry,
    timeZone
  } = props

  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  // Log error if no access token provided and metric is provided
  if (!accessToken && metric) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  /**
   * @hook react-query wrapper
   * @param {LeaderboardQuery} data
   * @returns {data: LeaderboardQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading } = useLeaderboardQuery<LeaderboardQuery, Error>(
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
      leaderboardInput: {
        metricName: metric,
        filters: filters,
        sort: sort,
        rowLimit: rowLimit ?? 100,
        dimensions: dimensions ?? [],
        timeZone: timeZone ?? getTimeZone(),
        timeRange: {
          relative: timeRange?.relative ?? null,
          n: timeRange?.n ?? null,
          start: timeRange?.start ?? null,
          stop: timeRange?.stop ?? null
        }
      }
    },
    {
      refetchInterval,
      retry,
      enabled: accessToken != null
    }
  )

  return {
    data,
    isLoading: isInitialLoading ?? isLoadingAccessToken,
    error: accessTokenError ?? error
  }
}
