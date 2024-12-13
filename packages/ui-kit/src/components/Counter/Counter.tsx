'use client'

import classnames from 'classnames'
import React from 'react'
import { getTimeZone, useCombinedRefsCallback, withThemeWrapper } from '../../helpers'
import { useCounter } from '../../hooks/useCounter'
import { useParsedComponentProps } from '../../themes'
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { Loader, LoaderProps } from '../Loader'
import { useLog } from '../Log'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Counter.module.scss'
import type { CounterProps } from './Counter.types'
import { getValueWithPrefixAndSufix } from './utils'

export const CounterComponent = React.forwardRef<HTMLSpanElement, CounterProps>(
  (
    {
      value: staticValue,
      query,
      prefixValue,
      sufixValue,
      loading: isLoadingStatic = false,
      localize,
      className,
      loaderProps: loaderPropsInitial,
      renderLoader,
      errorFallbackProps: errorFallbackPropsInitial,
      errorFallback,
      renderEmpty,
      timeZone,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      card,
      ...rest
    },
    forwardedRef
  ) => {
    const { themeSettings, parsedProps } = useParsedComponentProps(rest)
    const innerRef = React.useRef<HTMLSpanElement>(null)
    const { componentContainer, setRef, ref } = useCombinedRefsCallback({ forwardedRef, innerRef })
    const themeWrapper = withThemeWrapper(setRef)

    const {
      theme,
      renderLoader: renderLoaderComponent,
      errorFallback: errorFallbackComponent,
      renderEmpty: renderEmptyComponent
    } = useSetupTheme({
      componentContainer,
      renderLoader,
      errorFallback,
      renderEmpty,
      ...themeSettings
    })

    const log = useLog()

    /**
     * If the user passes `value` attribute, it
     * should behave as a static component without any GraphQL operation performed
     */
    const isStatic = !query

    const [propsMismatch, setPropsMismatch] = React.useState(false)
    const { data, isLoading, error } = useCounter({
      ...query,
      timeZone: getTimeZone(query?.timeZone ?? timeZone),
      enabled: !isStatic
    })

    const lastValue = React.useRef(data?.counter?.value) // Prevent flickering when the value is fetching due to filters change
    const value = isStatic ? staticValue : data?.counter?.value ?? lastValue.current

    if (value != null) {
      lastValue.current = value
    }

    React.useEffect(() => {
      function handlePropsMismatch() {
        if (isStatic && value === undefined) {
          log.error('InvalidPropsError: You must pass either `value` or `query` props')
          setPropsMismatch(true)
          return
        }

        if (!isStatic && (error?.name === 'AccessTokenError' || !query?.metric)) {
          log.error(
            'InvalidPropsError: When opting for fetching data you must pass at least `accessToken` and `metric` in the `query` prop'
          )
          setPropsMismatch(true)
          return
        }

        setPropsMismatch(false)
      }

      if (!isLoadingStatic) {
        handlePropsMismatch()
      }
    }, [isStatic, value, query, isLoadingStatic, error?.name, log])

    if (error || propsMismatch) {
      const errorFallbackProps: ErrorFallbackProps = {
        error: null,
        ...errorFallbackPropsInitial,
        style: { height: 'auto', ...errorFallbackPropsInitial?.style }
      }

      if (errorFallbackComponent) {
        return themeWrapper(errorFallbackComponent({ errorFallbackProps, ErrorFallback, theme }))
      }

      return <ErrorFallback ref={setRef} {...errorFallbackProps} />
    }

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoading)) && !ref?.current?.getAttribute('data-container')) {
      const loaderProps: LoaderProps = { isText: true, ...loaderPropsInitial }

      if (renderLoaderComponent) {
        return themeWrapper(renderLoaderComponent({ loaderProps, Loader, theme }))
      }

      return <Loader ref={setRef} className={componentStyles.loader} {...loaderProps} />
    }

    if ((value === '' || value === null) && renderEmptyComponent) {
      return themeWrapper(renderEmptyComponent({ theme }))
    }

    console.log(value)

    return (
      <span
        ref={setRef}
        className={classnames(
          componentStyles.rootCounter,
          {
            [componentStyles.loading]: isLoading || isLoadingStatic
          },
          className
        )}
        {...parsedProps}
        data-container
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
)

CounterComponent.displayName = 'CounterComponent'

export const Counter = withContainer(CounterComponent, ErrorFallback) as typeof CounterComponent
