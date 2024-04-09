import { PROPEL_GRAPHQL_API_ENDPOINT } from '../../helpers'
import { ChartProp } from '../../components/Report'
import { useAccessToken } from '../../components'
import { useEffect, useMemo, useRef, useState } from 'react'

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
}

export function useReportComponents(charts: ChartProp[], options?: Options) {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { accessToken } = useAccessToken()

  const memoizedCharts = useRef(charts)

  const fetchers = useMemo(
    () =>
      memoizedCharts.current.map((chart) =>
        fetcher(
          options?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
          {
            headers: {
              'content-type': 'application/graphql-response+json',
              authorization: `Bearer ${accessToken}`
            }
          },
          chart.query ?? '',
          JSON.parse(chart.variables ?? '{}')
        )
      ),
    [accessToken, options?.propelApiUrl]
  )

  useEffect(() => {
    async function getData() {
      const result = await Promise.allSettled(fetchers.map((fetcher) => fetcher()))
      setResult(result.map((res) => (res.status === 'fulfilled' ? res.value : null)))
      setIsLoading(false)
    }

    if (accessToken) {
      getData()
    }
  }, [accessToken, fetchers])

  return { charts: charts.map((chart, idx) => ({ ...chart, result: result != null ? result[idx] : null })), isLoading }
}
