import { LeaderboardQueryProps, useAccessToken, useLog } from '../../components'
import { LeaderboardQuery, PROPEL_GRAPHQL_API_ENDPOINT, getTimeZone, useLeaderboardQuery } from '../../helpers'

interface useLeaderboardProps {
  query?: LeaderboardQueryProps
  timeZone?: string
}
export const useLeaderboard = (props?: useLeaderboardProps) => {
  const { query, timeZone } = props

  const log = useLog()

  const { accessToken: accessTokenFromProvider, isLoading: isLoadingAccessToken } = useAccessToken()

  const accessToken = query?.accessToken ?? accessTokenFromProvider

  if (query && !accessToken) {
    log.error('No access token provided.')
  }

  const { data, error, isInitialLoading } = useLeaderboardQuery<LeaderboardQuery, Error>(
    {
      endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/graphql-response+json',
          authorization: `Bearer ${accessToken}`
        }
      }
    },
    {
      leaderboardInput: {
        metricName: query?.metric,
        filters: query?.filters,
        sort: query?.sort,
        rowLimit: query?.rowLimit ?? 100,
        dimensions: query?.dimensions,
        timeZone: timeZone ?? getTimeZone(),
        timeRange: {
          relative: query?.timeRange?.relative ?? null,
          n: query?.timeRange?.n ?? null,
          start: query?.timeRange?.start ?? null,
          stop: query?.timeRange?.stop ?? null
        }
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: query && accessToken != null
    }
  )

  return {
    data,
    isLoadingQuery: isInitialLoading ?? isLoadingAccessToken,
    error,
    hasNotAccessToken: !accessToken
  }
}
