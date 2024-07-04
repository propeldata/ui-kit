import classnames from 'classnames'
import React from 'react'
import { ThemeAppearances } from 'src/themes'
import { useForwardedRefCallback } from '../../helpers'
import { useSetupTheme } from '../ThemeProvider'
import componentStyles from './Loader.module.scss'

export interface LoaderProps extends React.ComponentPropsWithoutRef<'div'> {
  isText?: boolean
  appearance?: ThemeAppearances
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ children, className, isText, appearance, ...rest }, forwardedRef) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, appearance })

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
