import { useFilters } from '@/components/FilterProvider/useFilters'
import { RecordsByIdQueryProps } from '../../components/RecordsById/RecordsById.types'
import { PROPEL_GRAPHQL_API_ENDPOINT, RecordsByUniqueIdQuery, useRecordsByUniqueIdQuery } from '../../graphql'
import { UseQueryProps } from '../types/Query.types'
import { useAccessToken } from './../../components/AccessTokenProvider/useAccessToken'
import { useLog } from './../../components/Log/useLog'

/**
 * This hook allows you to query Records By Id using Propel's GraphQL API.
 * Use it to build custom components that require Records By Id data.
 * @hook useRecordsById
 * @param props
 * @returns {data: RecordsByUniqueIdQuery | undefined, isLoading: boolean, error: Error | undefined}
 */
export const useRecordsById = ({
  dataPool: dataPoolProp,
  uniqueIds,
  columns,
  accessToken: accessTokenFromProp,
  propelApiUrl,
  refetchInterval,
  enabled: enabledProp = true,
  retry
}: RecordsByIdQueryProps): UseQueryProps<RecordsByUniqueIdQuery> => {
  const log = useLog()

  // Get access token using useAccessToken hook
  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  const { dataPool: defaultDataPool } = useFilters()

  const dataPool = dataPoolProp ?? defaultDataPool

  // Get access token first from props, then if it is not provided via prop get it from provider
  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null

  // Log error if no access token provided and metric is provided
  if (!enabled) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  /**
   * @hook react-query wrapper
   * @param {RecordsByUniqueIdQuery} data
   * @returns {data: RecordsByUniqueIdQuery | undefined, isInitialLoading: boolean, error: Error | undefined}
   */
  const { data, error, isInitialLoading, isLoading } = useRecordsByUniqueIdQuery<RecordsByUniqueIdQuery, Error>(
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
      recordsByUniqueIdInput: {
        dataPool,
        uniqueIds,
        columns
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
    isLoading: (isInitialLoading || (isLoading && enabledProp)) ?? isLoadingAccessToken,
    error: enabled ? error : accessTokenError
  }
}
