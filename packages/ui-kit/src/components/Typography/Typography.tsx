import classnames from 'classnames'
import React from 'react'
import componentStyles from './Typography.module.scss'

export type TypographyProps<T extends React.ElementType = 'span'> = React.ComponentPropsWithoutRef<T> & {
  as?: T
  variant?: 'textMdRegular' | 'textMdSemibold' | 'textXsRegular' | 'textXxsRegular' | 'textSmRegular'
  block?: boolean
}

export const Typography = <T extends React.ElementType = 'span'>({
  as,
  children,
  className,
  variant = 'textMdRegular',
  block,
  ...rest
}: TypographyProps<T>) => {
  const Component = as || 'span'
  return (
    <Component
      {...rest}
      className={classnames(
        componentStyles.rootTypography,
        componentStyles[variant],
        block && componentStyles.block,
        className
      )}
      data-testid="typography"
    >
      {children}
    </Component>
  )
}
