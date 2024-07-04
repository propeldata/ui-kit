import classnames from 'classnames'
import React from 'react'
import { ThemeAppearances } from 'src/themes'
import { useForwardedRefCallback } from '../../helpers'
import { useSetupTheme } from '../ThemeProvider'
import componentStyles from './Card.module.scss'

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  appearance?: ThemeAppearances
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, appearance, ...rest }, forwardedRef) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, appearance })

    return (
      <div ref={setRef} className={classnames(componentStyles.rootCard, className)} data-testid="card" {...rest}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
