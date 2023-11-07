import classnames from 'classnames'
import React from 'react'
import themes from '../../themes/themes.module.css'
import { useTheme } from '../ThemeProvider'
import componentStyles from './Loader.module.css'

export interface LoaderProps extends React.ComponentPropsWithoutRef<'div'> {
  isText?: boolean
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ children, className, isText, ...other }, forwardedRef) => {
    const theme = useTheme()
    return (
      <div
        ref={forwardedRef}
        className={classnames(!theme?.themeClassName && themes.lightTheme, componentStyles.rootLoader, className)}
        role="alert"
        aria-live="polite"
        {...other}
      >
        <p hidden>Loading...</p>
        <div
          data-role="loader-animation"
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
