export interface ChartProp {
  id: string
  query?: string
  type: 'timeSeries' | 'leaderboard' | 'counter' | ''
  variables?: string
}
