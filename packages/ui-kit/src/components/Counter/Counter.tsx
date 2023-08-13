import { css } from '@emotion/css'
import React from 'react'
import { getTimeZone, PROPEL_GRAPHQL_API_ENDPOINT, useCounterQuery } from '../../helpers'
import type { ChartStyles } from '../../themes'
import { defaultStyles } from '../../themes'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { withContainer } from '../withContainer'
import type { CounterProps } from './Counter.types'
import { getValueWithPrefixAndSufix } from './utils'

export const CounterComponent = (props: CounterProps) => {
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
      endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
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
        timeZone: props.timeZone ?? getTimeZone(),
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
    return <ErrorFallback error={null} styles={styles} />
  }

  if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && !counterRef.current) {
    return <Loader styles={styles}>000</Loader>
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

export const Counter = withContainer(CounterComponent, ErrorFallback) as typeof CounterComponent

const getFontStyles = (styles?: ChartStyles) => css`
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
