import classNames from 'classnames'
import React from 'react'
import componentStyles from './Divider.module.scss'

export type DividerProps<T extends React.ElementType = 'li'> = React.ComponentPropsWithoutRef<T> & { as?: T }

export const Divider = <T extends React.ElementType = 'li'>({ as, className, ...rest }: DividerProps<T>) => {
  const Component = as || 'li'
  return <Component {...rest} className={classNames(componentStyles.rootDivider, className)} role="separator" />
}
