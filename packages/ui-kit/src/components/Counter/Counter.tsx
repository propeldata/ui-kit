import React from 'react'
import { CounterQuery, getTimeZone, PROPEL_GRAPHQL_API_ENDPOINT, useCounterQuery } from '../../helpers'
import '../../themes/light-theme.module.css'
import themes from '../../themes/themes.module.css'
import { useAccessToken } from '../AccessTokenProvider/useAccessToken'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Counter.module.css'
import type { CounterProps } from './Counter.types'
import { getValueWithPrefixAndSufix } from './utils'

export const CounterComponent = (props: CounterProps) => {
  const theme = useTheme()

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

  const { accessToken: accessTokenFromProvider, isLoading: isLoadingAccessToken } = useAccessToken()

  /**
   * If the user passes `value` attribute, it
   * should behave as a static component without any GraphQL operation performed
   */
  const isStatic = !query

  const [propsMismatch, setPropsMismatch] = React.useState(false)

  const counterRef = React.useRef<HTMLSpanElement>(null)

  const accessToken = query?.accessToken ?? accessTokenFromProvider

  const {
    isInitialLoading: isLoadingQuery,
    error,
    data: fetchedValue
  } = useCounterQuery<CounterQuery, Error>(
    {
      endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/graphql-response+json',
          authorization: `Bearer ${accessToken}`
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
        filters: query?.filters ?? []
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: !isStatic && accessToken != null
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

      if (
        !isStatic &&
        ((!query?.accessToken && !accessTokenFromProvider && !isLoadingAccessToken) ||
          !query?.metric ||
          !query?.timeRange)
      ) {
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
  }, [isStatic, value, query, isLoadingStatic, accessTokenFromProvider, isLoadingAccessToken])

  if (error || propsMismatch) {
    return <ErrorFallback error={null} styles={styles} />
  }


  if (((isStatic && isLoadingStatic) || (!isStatic && (isLoadingQuery || isLoadingAccessToken))) && !counterRef.current) {
    return <Loader styles={styles}>&#160;</Loader>
  }

  return (
    <span
      ref={counterRef}
      style={{
        opacity: isLoadingQuery || isLoadingStatic ? '0.3' : '1',
        transition: 'opacity 0.2s ease-in-out'
      }}
      {...rest}
      className={[theme.theme ? undefined : themes.lightTheme, componentStyles.rootCounter].join(' ')}
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
