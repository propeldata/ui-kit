import classnames from 'classnames'
import React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { DefaultThemes, useSetupTheme } from '../ThemeProvider'
import componentStyles from './Card.module.scss'

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  baseTheme?: DefaultThemes
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, baseTheme, ...rest }, forwardedRef) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, baseTheme })

    return (
      <div ref={setRef} className={classnames(componentStyles.rootCard, className)} {...rest}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
