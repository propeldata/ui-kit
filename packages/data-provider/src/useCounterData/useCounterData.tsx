import { PROPEL_GRAPHQL_API_ENDPOINT, useCounterQuery } from '../graphql'

export const useCounterData = (props: any) => {
  const { query } = props

  console.log('useCounterData query', query)

  const {
    isInitialLoading: isLoadingQuery,
    error,
    data: fetchedValue
  } = useCounterQuery(
    {
      endpoint: PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${query?.accessToken}`
        }
      }
    },
    {
      counterInput: {
        metricName: query?.metric,
        timeRange: {
          relative: query?.timeRange?.relative ?? null,
          n: query?.timeRange?.n ?? null,
          start: query?.timeRange?.start ?? null,
          stop: query?.timeRange?.stop ?? null
        },
        filters: query?.filters ?? [],
        propeller: query?.propeller
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: true
    }
  )

  return {
    isLoadingQuery,
    error,
    fetchedValue
  }
}
