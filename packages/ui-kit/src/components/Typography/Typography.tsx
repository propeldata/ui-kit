import classnames from 'classnames'
import React from 'react'
import componentStyles from './Typography.module.scss'

export type TypographyProps<T extends React.ElementType = 'span'> = React.ComponentPropsWithoutRef<T> & {
  as?: T
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  block?: boolean
}

export const Typography = <T extends React.ElementType = 'span'>({
  as,
  children,
  className,
  size = 2,
  weight = 'regular',
  block,
  ...rest
}: TypographyProps<T>) => {
  const Component = as || 'span'
  return (
    <Component
      {...rest}
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
