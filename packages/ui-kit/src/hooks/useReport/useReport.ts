import { useAccessToken } from '../../components'
import { PROPEL_GRAPHQL_API_ENDPOINT, ReportQuery, useReportQuery } from '../../helpers'
import { ReportQueryProp } from '../../components/Report/Report.types'

export function useReport(props: Partial<ReportQueryProp>) {
  const { accessToken: accessTokenFromProp, propelApiUrl, reportId, enabled = true } = props

  const { accessToken: accessTokenFromProvider, isLoading: isLoadingAccessToken } = useAccessToken()

  const accessToken = accessTokenFromProp ?? accessTokenFromProvider

  const { data, isLoading } = useReportQuery<ReportQuery, Error>(
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
      id: reportId ?? ''
    },
    {
      enabled: accessToken != null && enabled
    }
  )

  return { data, isLoading: isLoading || isLoadingAccessToken }
}
