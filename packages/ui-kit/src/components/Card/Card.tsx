import classnames from 'classnames'
import React from 'react'
import { useCombinedRefsCallback } from '../../helpers'
import { DefaultThemes, useTheme } from '../ThemeProvider'
import componentStyles from './Card.module.scss'

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  baseTheme?: DefaultThemes
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, baseTheme, ...rest }, forwardedRef) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    useTheme({ componentContainer, baseTheme })

    return (
      <div ref={setRef} className={classnames(componentStyles.rootCard, className)} {...rest}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
