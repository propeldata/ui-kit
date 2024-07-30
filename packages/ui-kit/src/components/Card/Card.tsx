import classnames from 'classnames'
import React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { ThemeSettingProps, useParsedComponentProps } from '../../themes'
import { useSetupTheme } from '../ThemeProvider'
import componentStyles from './Card.module.scss'

export interface CardProps extends ThemeSettingProps, React.ComponentPropsWithoutRef<'div'> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className, ...rest }, forwardedRef) => {
  const { themeSettings, parsedProps } = useParsedComponentProps(rest)
  const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
  useSetupTheme({ componentContainer, ...themeSettings })

  return (
    <div ref={setRef} className={classnames(componentStyles.rootCard, className)} {...parsedProps} data-testid="card">
      {children}
    </div>
  )
})

Card.displayName = 'Card'
