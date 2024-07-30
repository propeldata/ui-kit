import classnames from 'classnames'
import React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { ThemeSettingProps, useParsedComponentProps } from '../../themes'
import { useSetupTheme } from '../ThemeProvider'
import componentStyles from './Loader.module.scss'

export interface LoaderProps extends ThemeSettingProps, React.ComponentPropsWithoutRef<'div'> {
  isText?: boolean
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ children, className, isText, ...rest }, forwardedRef) => {
    const { themeSettings, parsedProps } = useParsedComponentProps(rest)
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, ...themeSettings })

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootLoader, className)}
        role="alert"
        aria-live="polite"
        {...parsedProps}
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
