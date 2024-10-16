'use client'

import { useButton } from '@mui/base/useButton'
import classnames from 'classnames'
import * as React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { ThemeSettingProps, useParsedComponentProps } from '../../themes'
import { ThemeStateProps, useSetupTheme } from '../ThemeProvider'
import componentStyles from './Button.module.scss'

export interface ButtonProps extends ThemeSettingProps, React.ComponentPropsWithoutRef<'button'> {
  overridable?: boolean
  variant?: 'outline' | 'primary'
  size?: 'default' | 'small'
  startAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
  endAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const {
    children,
    className,
    disabled,
    role = 'button',
    variant = 'outline',
    size = 'default',
    startAdornment,
    endAdornment,
    overridable,
    value,
    ...rest
  } = props
  const { themeSettings, parsedProps } = useParsedComponentProps(rest)
  const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
  const { theme, components } = useSetupTheme({ componentContainer, ...themeSettings })
  const { active, focusVisible, getRootProps } = useButton({
    ...props,
    rootRef: setRef
  })

  if (overridable && components?.Button) {
    return components.Button(props)
  }

  return (
    <button
      {...getRootProps()}
      {...parsedProps}
      role={role}
      className={classnames(
        componentStyles.rootButton,
        {
          [componentStyles.focus]: focusVisible,
          [componentStyles.disabled]: disabled,
          [componentStyles.active]: active,
          [componentStyles.startAdornment]: startAdornment,
          [componentStyles.endAdornment]: endAdornment,
          [componentStyles[variant]]: variant && variant !== 'outline',
          [componentStyles[size]]: size && size !== 'default'
        },
        className
      )}
    >
      {startAdornment && startAdornment({ theme })}
      {value ?? children}
      {endAdornment && endAdornment({ theme })}
    </button>
  )
})

Button.displayName = 'Button'
