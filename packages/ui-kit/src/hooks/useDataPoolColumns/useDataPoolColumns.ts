import {
  DataPoolColumnsByNameQuery,
  DataPoolColumnsQuery,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useDataPoolColumnsByNameQuery,
  useDataPoolColumnsQuery
} from '../../graphql'
import { useAccessToken, useLog } from '../../components'
import { GroupByQueryProps } from '../../components/GroupBy/GroupBy.types'
import { useMemo } from 'react'

export const useDataPoolColumns = ({
  accessToken: accessTokenFromProp,
  dataPool,
  enabled: enabledProp,
  propelApiUrl,
  refetchInterval,
  retry
}: GroupByQueryProps) => {
  const log = useLog()

  const {
    accessToken: accessTokenFromProvider,
    isLoading: isLoadingAccessToken,
    error: accessTokenError
  } = useAccessToken()

  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const enabled = accessToken != null && enabledProp

  if (accessToken == null && dataPool != null && !isLoadingAccessToken) {
    log.error(accessTokenError ?? 'No access token provided.')
  }

  const {
    data: columnsByIdData,
    error: columnsByIdError,
    isInitialLoading: isLoadingColumnsById
  } = useDataPoolColumnsQuery<DataPoolColumnsQuery, Error>(
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
      dataPoolId: dataPool?.id ?? ''
    },
    {
      enabled: enabled && dataPool?.id != null,
      refetchInterval,
      retry
    }
  )

  const {
    data: columnsByNameData,
    error: columnsByNameError,
    isInitialLoading: isLoadingColumnsByName
  } = useDataPoolColumnsByNameQuery<DataPoolColumnsByNameQuery, Error>(
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
      dataPoolName: dataPool?.name ?? ''
    },
    {
      enabled: enabled && dataPool?.name != null && dataPool?.id == null,
      refetchInterval,
      retry
    }
  )

  const columns = useMemo(() => {
    const columns = columnsByIdData?.dataPool?.columns?.nodes ?? columnsByNameData?.dataPoolByName?.columns?.nodes ?? []

    // Remove JSON columns not supported by GroupBy
    return columns.filter((column) => column.type !== 'JSON')
  }, [columnsByIdData, columnsByNameData])

  return {
    columns,
    isLoading: isLoadingColumnsById || isLoadingColumnsByName,
    error: columnsByIdError ?? columnsByNameError
  }
}
