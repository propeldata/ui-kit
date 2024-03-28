import { useOption } from '@mui/base/useOption'
import classnames from 'classnames'
import * as React from 'react'
import { useForwardedRefCallback } from '../../../helpers'
import { DefaultThemes, useSetupTheme } from '../../ThemeProvider'
import componentStyles from './Option.module.scss'

export interface OptionProps extends React.ComponentPropsWithoutRef<'li'> {
  disabled?: boolean
  baseTheme?: DefaultThemes
}

export const Option = React.forwardRef<HTMLLIElement, OptionProps>(
  ({ baseTheme, className, children, value, disabled = false, ...rest }, forwardedRef) => {
    const { getRootProps } = useOption({
      value,
      disabled,
      label: children
    })

    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, baseTheme })

    return (
      <li
        {...getRootProps()}
        {...rest}
        value={value}
        className={classnames(componentStyles.rootOption, className)}
        ref={setRef}
      >
        {children}
      </li>
    )
  }
)

Option.displayName = 'List'
