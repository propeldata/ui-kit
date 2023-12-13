import classnames from 'classnames'
import React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { DefaultThemes, useSetupTheme } from '../ThemeProvider'
import componentStyles from './Loader.module.scss'

export interface LoaderProps extends React.ComponentPropsWithoutRef<'div'> {
  isText?: boolean
  baseTheme?: DefaultThemes
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ children, className, isText, baseTheme, ...rest }, forwardedRef) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, baseTheme })

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootLoader, className)}
        role="alert"
        aria-live="polite"
        {...rest}
      >
        <p hidden>Loading&hellip;</p>
        <div
          data-role="loader-animation"
          data-testid="loader-animation"
          className={classnames(componentStyles.loaderAnimation, isText && componentStyles.emptyText)}
        >
          {children}
          {isText && !children && '&#160;'}
        </div>
      </div>
    )
  }
)

Loader.displayName = 'Loader'
