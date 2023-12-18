import type { DataComponentProps, QueryProps } from '../shared.types'
import type { ThemeComponentProps } from '../../themes'

export type CounterQueryProps = QueryProps

export interface CounterProps
  extends ThemeComponentProps,
    Omit<React.ComponentProps<'span'>, 'style'>,
    DataComponentProps {
  /** If passed, the component will ignore the built-in GraphQL operations */
  value?: string

  /** Symbol to be shown before the value text */
  prefixValue?: string

  /** Symbol to be shown after the value text */
  sufixValue?: string

  /** When true, formats value to locale string */
  localize?: boolean

  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone. */
  timeZone?: string

  /** Counter query props */
  query?: CounterQueryProps

  /** When true, shows a skeleton loader */
  loading?: boolean
}
