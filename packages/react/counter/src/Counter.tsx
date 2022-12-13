import React from 'react'
import request from 'graphql-request'

import { CounterStyles } from './types'
import {
  DEFAULT_PROPEL_API,
  getAlignItemsByPosition,
  getJustifyContentByPosition,
  getTextAlignByPosition,
  getValueWithPrefixAndSufix,
  QUERY
} from './utils'
import { stylesInitialState } from './styles'

import './styles.css'

interface Props {
  /** If passed, the component will ignore the built-in graphql operations */
  value?: string
  /** Metric unique name will be ignored when value is passed */
  metric?: string
  /** Relative time range that the chart will respond to. Will be ignored when value is passed */
  relativeTimeRange?: string
  /** This should eventually be replaced to customer's app credentials. Will be ignored when value is passed */
  accessToken?: string
  /** Symbol to be shown before the value text */
  prefixValue?: string
  /** Symbol to be shown after the value text */
  sufixValue?: string
  /** Basic styles initial state */
  styles?: CounterStyles
}

export function Counter(props: Props) {
  const { value, metric, relativeTimeRange, accessToken, prefixValue, sufixValue, styles } = props

  const [fetchedValue, setFetchedValue] = React.useState('')

  const containerRef = React.useRef<HTMLDivElement>(null)
  const valueRef = React.useRef<HTMLDivElement>(null)

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
        uniqueName: metric,
        counterInput: {
          timeRange: {
            relative: relativeTimeRange
          }
        }
      },
      {
        authorization: `Bearer ${accessToken}`
      }
    )

    const metricData = response.metricByName.counter

    setFetchedValue(metricData.value)
  }, [accessToken, metric, relativeTimeRange])

  const setupStyles = React.useCallback(() => {
    const {
      width = stylesInitialState.width,
      height = stylesInitialState.height,
      color = stylesInitialState.color,
      fontSize,
      position = stylesInitialState.position,
      background = stylesInitialState.background
    } = styles || {}

    const containerElement = containerRef.current
    const valueElement = valueRef.current

    if (containerElement && valueElement) {
      containerElement.style.width = width
      containerElement.style.height = height
      containerElement.style.backgroundColor = background
      containerElement.style.alignItems = getAlignItemsByPosition(position)
      containerElement.style.justifyContent = getJustifyContentByPosition(position)

      valueElement.style.textAlign = getTextAlignByPosition(position)
      valueElement.style.color = color
      valueElement.style.fontSize = fontSize || '48px'
    }
  }, [styles])

  React.useEffect(() => {
    async function setup() {
      if (!isDumb && !fetchedValue) {
        await fetchData()
      }
      setupStyles()
    }

    setup()
  }, [setupStyles, fetchData, isDumb, fetchedValue])

  if (!value && !fetchedValue) return null

  return (
    <div ref={containerRef} className="counter-container">
      <div ref={valueRef} className="counter-value">
        ${getValueWithPrefixAndSufix({ prefix: prefixValue, value: value || fetchedValue, sufix: sufixValue })}
      </div>
    </div>
  )
}
