export interface ChartProp {
  id?: string
  title?: string
  query?: string
  type?: 'timeSeries' | 'leaderboard' | 'counter' | '' | string
  variables?: string
}

export interface ReportQueryProp {
  reportId: string
  /**
   * Access token used for the query. While you can pass this one to each component, we recommend wrapping components in the `AccessTokenProvider` instead:
   * @example
   * ```jsx
   * <AccessTokenProvider fetchToken={fetchToken}>
   *   <Counter />
   *   <TimeSeries />
   *   <Leaderboard />
   * </AccessTokenProvider>
   * ```
   * */
  accessToken?: string
  propelApiUrl?: string
  enabled?: boolean
}

export interface ReportProps {
  title?: string
  layout?: string[][]
  charts?: ChartProp[]
  clickable?: boolean
  onCardClick?: (chart: ChartProp | null | undefined) => void
  reportCardProps?: React.HTMLAttributes<HTMLDivElement>
  propelApiUrl?: string
  query?: ReportQueryProp
}
