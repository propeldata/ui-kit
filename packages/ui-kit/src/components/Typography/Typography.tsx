import classnames from 'classnames'
import React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { ThemeSettingProps, useParsedComponentProps } from '../../themes'
import { useSetupTheme } from '../ThemeProvider'
import componentStyles from './Typography.module.scss'

export type TypographyProps<T extends React.ElementType = 'span'> = React.ComponentPropsWithoutRef<T> &
  ThemeSettingProps & {
    as?: T
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    weight?: 'light' | 'regular' | 'medium' | 'bold'
    block?: boolean
  }

export const Typography = React.forwardRef(
  <T extends React.ElementType = 'span'>(
    { as, children, className, size = 2, weight = 'regular', block, ...rest }: TypographyProps<T>,
    forwardedRef: React.Ref<HTMLElement>
  ) => {
    const Component = as || 'span'
    const { themeSettings, parsedProps } = useParsedComponentProps(rest)
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, ...themeSettings })
    return (
      <Component
        {...parsedProps}
        ref={setRef}
        className={classnames(
          componentStyles.rootTypography,
          componentStyles[`weight-${weight}`],
          componentStyles[`size-${size}`],
          block && componentStyles.block,
          className
        )}
        data-testid="typography"
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'
