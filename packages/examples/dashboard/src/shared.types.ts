import { TimeRangeInput } from '@propeldata/ui-kit'

export interface Env {
  [key: string]: string | undefined
}
export interface DashboardCommonProps {
  envs: Env
}

export interface ConnectedComponentProps extends DashboardCommonProps {
  timeRange?: TimeRangeInput
}
