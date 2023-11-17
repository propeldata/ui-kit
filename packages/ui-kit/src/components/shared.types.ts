import type { ErrorFallbackProps } from './ErrorFallback'
import type { LoaderProps } from './Loader'

export type DataComponentProps = {
  /** Optional porps that are used to configure the Loader component. */
  loaderProps?: LoaderProps

  /** Optional porps that are used to configure the ErrorFallback component. */
  errorFallbackProps?: ErrorFallbackProps

  /** When true, wraps the component in a card */
  card?: boolean
}
