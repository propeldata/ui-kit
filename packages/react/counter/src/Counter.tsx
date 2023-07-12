import React from 'react'
import { TimeRangeInput, FilterInput, Propeller, useCounter } from '@propeldata/ui-kit-graphql'
import { css } from '@emotion/css'

import { getValueWithPrefixAndSufix } from './utils'
import type { Styles } from './types'
import { defaultStyles } from './defaults'
import { Loader } from './Loader'
import { ErrorFallback } from './ErrorFallback'

export interface CounterProps extends React.ComponentProps<'span'> {
  /** If passed, the component will ignore the built-in graphql operations */
  value?: string
  /** Symbol to be shown before the value text */
  prefixValue?: string
  /** Symbol to be shown after the value text */
  sufixValue?: string
  /** Basic styles initial state */
  styles?: Styles
  /** When true, formats value to locale string */
  localize?: boolean
  query?: {
    /** Time range that the chart will respond to. Will be ignored when value is passed */
    timeRange?: TimeRangeInput
    /** This should eventually be replaced to customer's app credentials. Will be ignored when value is passed */
    accessToken?: string
    /** Metric unique name will be ignored when value is passed */
    metric?: string
    /** Filters that the chart will respond to */
    filters?: FilterInput[]
    /** Propeller that the chart will respond to */
    propeller?: Propeller
  }
  /** When true, shows a skeleton loader */
  loading?: boolean
}

export function Counter(props: CounterProps) {
  const { value, query, prefixValue, sufixValue, styles, loading = false, localize, ...rest } = props

  /**
   * If the user passes `value` attribute, it
   * should behave as a static component without any graphql operation performed
   */
  const isStatic = !query

  const [dataValue, setDataValue] = React.useState<string | null>()
  const [propsMismatch, setPropsMismatch] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const counterRef = React.useRef<HTMLSpanElement>(null)

  const { value: fetchedValue, isLoading, error } = useCounter(query, { enabled: !isStatic })

  React.useEffect(() => {
    function handlePropsMismatch() {
      if (isStatic && !value) {
        // console.error('InvalidPropsError: You must pass either `value` or `query` props') we will set logs as a feature later
        setPropsMismatch(true)
        return
      }

      if (!isStatic && (!query?.accessToken || !query?.metric || !query?.timeRange)) {
        // console.error(
        //   'InvalidPropsError: When opting for fetching data you must pass at least `accessToken`, `metric` and `timeRange` in the `query` prop'
        // ) we will set logs as a feature later
        setPropsMismatch(true)
        return
      }

      setPropsMismatch(false)
    }

    if (!loading) {
      handlePropsMismatch()
    }
  }, [isStatic, value, query, loading])

  React.useEffect(() => {
    async function setup() {
      if (isStatic) {
        setDataValue(value)
      }

      if (!isStatic) {
        if (error) {
          setHasError(true)
          // console.error(`QueryError: Your metric ${query?.metric} returned undefined.`) we will set logs as a feature later
          return
        }

        setDataValue(fetchedValue)
      }
    }

    setup()
  }, [error, fetchedValue, isStatic, query?.metric, value])

  if (hasError || propsMismatch) {
    return <ErrorFallback styles={styles} />
  }

  if ((isLoading || loading || (dataValue === undefined && !isStatic)) && !counterRef.current) {
    return <Loader styles={styles} />
  }

  return (
    <span
      ref={counterRef}
      style={{
        opacity: isLoading || loading ? '0.3' : '1',
        transition: 'opacity 0.2s ease-in-out'
      }}
      {...rest}
      className={getFontStyles(styles)}
    >
      {getValueWithPrefixAndSufix({
        prefix: prefixValue,
        value: dataValue,
        sufix: sufixValue,
        localize
      })}
    </span>
  )
}

const getFontStyles = (styles?: Styles) => css`
  color: ${styles?.font?.color || defaultStyles.font.color};
  font-size: ${styles?.font?.size || defaultStyles.font.size};
  font-family: ${styles?.font?.family || defaultStyles.font.family};
  font-weight: ${styles?.font?.weight || defaultStyles.font.weight};
  font-stretch: ${styles?.font?.stretch || defaultStyles.font.stretch};
  font-variant: ${styles?.font?.variant || defaultStyles.font.variant};
  font-style: ${styles?.font?.style || defaultStyles.font.style};
  line-height: ${styles?.font?.lineHeight || defaultStyles.font.lineHeight};

  white-space: nowrap;
`
