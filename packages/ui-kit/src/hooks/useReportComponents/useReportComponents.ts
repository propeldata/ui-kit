import { PROPEL_GRAPHQL_API_ENDPOINT } from '../../helpers'
import { ChartProp } from '../../components/Report'
import { useAccessToken } from '../../components'
import { useEffect, useMemo, useState } from 'react'

function fetcher<TData>(endpoint: string, requestInit: RequestInit, query: string, variables?: string) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables })
    })

    const json = await res.json()

    if (json.errors) {
      const { message } = json.errors[0]

      throw new Error(message)
    }

    return json.data
  }
}

interface Options {
  propelApiUrl?: string
  accessToken?: string
}

export function useReportComponents(charts: Array<ChartProp | null | undefined> | null | undefined, options?: Options) {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { accessToken: accessTokenFromProvider } = useAccessToken()

  const accessToken = options?.accessToken ?? accessTokenFromProvider

  const fetchers = useMemo(
    () =>
      charts?.map((chart) =>
        fetcher(
          options?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
          {
            headers: {
              'content-type': 'application/graphql-response+json',
              authorization: `Bearer ${accessToken}`
            }
          },
          chart?.query ?? '',
          JSON.parse(chart?.variables ?? '{}')
        )
      ),
    [accessToken, options?.propelApiUrl, charts]
  )

  useEffect(() => {
    async function getData() {
      if (fetchers != null) {
        const result = await Promise.allSettled(fetchers.map((fetcher) => fetcher()))
        setResult(result.map((res) => (res.status === 'fulfilled' ? res.value : null)))
        setIsLoading(false)
      }
    }

    if (accessToken != null) {
      getData()
    }
  }, [accessToken, fetchers])

  console.log(result)

  return { charts: charts?.map((chart, idx) => ({ ...chart, result: result != null ? result[idx] : null })), isLoading }
}
