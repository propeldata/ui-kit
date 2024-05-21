import classNames from 'classnames'
import React from 'react'
import componentStyles from './Divider.module.scss'

export type DividerProps<T extends React.ElementType = 'hr'> = React.ComponentPropsWithoutRef<T> & { as?: T }

export const Divider = <T extends React.ElementType = 'hr'>({ as, className, ...rest }: DividerProps<T>) => {
  const Component = as || 'hr'
  return <Component {...rest} className={classNames(componentStyles.rootDivider, className)} role="separator" />
}
