import type { ErrorFallbackProps } from './ErrorFallback'
import type { LoaderProps } from './Loader'

/** Shared props for the data components. */

export type DataComponentProps = {
  /** Optional props that are used to configure the Loader component. */
  loaderProps?: LoaderProps

  /** Optional props that are used to configure the ErrorFallback component. */
  errorFallbackProps?: ErrorFallbackProps

  /** When true, wraps the component in a card */
  card?: boolean
}
