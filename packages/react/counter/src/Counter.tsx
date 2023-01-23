import React from 'react'
import request from 'graphql-request'
import { PROPEL_GRAPHQL_API_ENDPOINT, CounterDocument } from '@propeldata/ui-kit-graphql'

import { getValueWithPrefixAndSufix } from './utils'
import type { Styles } from './types'
import { defaultStyles } from './defaults'
import { Loader } from './Loader'
import { ErrorFallback } from './ErrorFallback'

export interface CounterProps {
  /** If passed, the component will ignore the built-in graphql operations */
  value?: string
  /** Symbol to be shown before the value text */
  prefixValue?: string
  /** Symbol to be shown after the value text */
  sufixValue?: string
  /** Basic styles initial state */
  styles?: Styles
  query?: {
    /** Relative time range that the chart will respond to. Will be ignored when value is passed */
    relativeTimeRange?: string
    /** This should eventually be replaced to customer's app credentials. Will be ignored when value is passed */
    accessToken?: string
    /** Metric unique name will be ignored when value is passed */
    metric?: string
  }
  /** When true, shows a skeleton loader */
  isLoading?: boolean
}

export function Counter(props: CounterProps) {
  const { value, query, prefixValue, sufixValue, styles, isLoading: isLoadingProp } = props

  const containerRef = React.useRef<HTMLDivElement>(null)

  /**
   * If the user passes `value` attribute, it
   * should behave as a dumb component without any graphql operation performed
   */
  const isDumb = !!value

  const [dataValue, setDataValue] = React.useState('')
  const [hasError, setHasError] = React.useState(false)
  // const [isLoading, setIsLoading] = React.useState(!isDumb && isLoadingProp)

  const isLoading = isLoadingProp

  /**
   * Fetches the counter data
   * when the user doesn't provide
   * its own `value`
   */
  const fetchData = React.useCallback(async () => {
    try {
      // setIsLoading(true)

      const response = await request(
        PROPEL_GRAPHQL_API_ENDPOINT,
        CounterDocument,
        {
          uniqueName: query?.metric,
          counterInput: {
            timeRange: {
              relative: query?.relativeTimeRange
            }
          }
        },
        {
          authorization: `Bearer ${query?.accessToken}`
        }
      )

      const metricData = response.metricByName.counter

      setHasError(false)

      return metricData.value
    } catch {
      setHasError(true)
    } finally {
      // setIsLoading(false)
    }
  }, [query])

  const setupStyles = React.useCallback(() => {
    const { font } = styles || {}

    const containerElement = containerRef.current

    if (containerElement) {
      containerElement.style.color = font?.color || defaultStyles.font.color
      containerElement.style.fontSize = font?.size || defaultStyles.font.size
    }
  }, [styles])

  React.useEffect(() => {
    async function setup() {
      setDataValue(isDumb ? value : await fetchData())
      setupStyles()
    }

    setup()
  }, [setupStyles, fetchData, isDumb, dataValue, value])

  if (isLoading) return <Loader styles={styles} />

  if (hasError) {
    return <ErrorFallback styles={styles} />
  }

  return (
    <span ref={containerRef}>
      {getValueWithPrefixAndSufix({ prefix: prefixValue, value: dataValue, sufix: sufixValue })}
    </span>
  )
}
