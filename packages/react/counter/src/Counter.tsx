import React from 'react'
import request from 'graphql-request'

import type { Styles } from './__types__'
import { DEFAULT_PROPEL_API, getValueWithPrefixAndSufix, QUERY } from './__utils__'
import { defaultStyles } from './__defaults__'

interface Props {
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
}

export function Counter(props: Props) {
  const { value, query, prefixValue, sufixValue, styles } = props

  const [dataValue, setDataValue] = React.useState('')

  const containerRef = React.useRef<HTMLDivElement>(null)

  /**
   * If the user passes `value` attribute, it
   * should behave as a dumb component without any graphql operation performed
   */
  const isDumb = !!value

  /**
   * Fetches the counter data
   * when the user doesn't provide
   * its own `value`
   */
  const fetchData = React.useCallback(async () => {
    const response = await request(
      DEFAULT_PROPEL_API,
      QUERY,
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

    return metricData.value
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

  if (!dataValue) return null

  return (
    <span ref={containerRef}>
      {getValueWithPrefixAndSufix({ prefix: prefixValue, value: dataValue, sufix: sufixValue })}
    </span>
  )
}
