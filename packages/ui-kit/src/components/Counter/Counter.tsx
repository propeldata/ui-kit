import React from 'react'
import { PROPEL_GRAPHQL_API_ENDPOINT, TimeRangeInput, FilterInput, Propeller, useCounterQuery } from '../../helpers'
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
    /** Interval in milliseconds for refetching the data */
    refetchInterval?: number
    /** Whether to retry on errors. */
    retry?: boolean
  }
  /** When true, shows a skeleton loader */
  loading?: boolean
}

export function Counter(props: CounterProps) {
  const {
    value: staticValue,
    query,
    prefixValue,
    sufixValue,
    styles,
    loading: isLoadingStatic = false,
    localize,
    ...rest
  } = props

  /**
   * If the user passes `value` attribute, it
   * should behave as a static component without any graphql operation performed
   */
  const isStatic = !query

  const [propsMismatch, setPropsMismatch] = React.useState(false)

  const counterRef = React.useRef<HTMLSpanElement>(null)

  const {
    isInitialLoading: isLoadingQuery,
    error,
    data: fetchedValue
  } = useCounterQuery(
    {
      endpoint: PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${query?.accessToken}`
        }
      }
    },
    {
      counterInput: {
        metricName: query?.metric,
        timeRange: {
          relative: query?.timeRange?.relative ?? null,
          n: query?.timeRange?.n ?? null,
          start: query?.timeRange?.start ?? null,
          stop: query?.timeRange?.stop ?? null
        },
        filters: query?.filters ?? [],
        propeller: query?.propeller
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: !isStatic
    }
  )

  const value = isStatic ? staticValue : fetchedValue?.counter?.value

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

    if (!isLoadingStatic) {
      handlePropsMismatch()
    }
  }, [isStatic, value, query, isLoadingStatic])

  if (error || propsMismatch) {
    return <ErrorFallback styles={styles} />
  }

  if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && !counterRef.current) {
    return <Loader styles={styles} />
  }

  return (
    <span
      ref={counterRef}
      style={{
        opacity: isLoadingQuery || isLoadingStatic ? '0.3' : '1',
        transition: 'opacity 0.2s ease-in-out'
      }}
      {...rest}
      className={getFontStyles(styles)}
    >
      {getValueWithPrefixAndSufix({
        prefix: prefixValue,
        value,
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
