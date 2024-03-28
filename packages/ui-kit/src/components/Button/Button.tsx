import { useButton } from '@mui/base/useButton'
import classnames from 'classnames'
import * as React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { DefaultThemes, ThemeStateProps, useSetupTheme } from '../ThemeProvider'
import componentStyles from './Button.module.scss'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  overridable?: boolean
  baseTheme?: DefaultThemes
  variant?: 'default' | 'primary'
  startAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
  endAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const {
    baseTheme,
    children,
    className,
    disabled,
    variant = 'default',
    startAdornment,
    endAdornment,
    overridable,
    value,
    ...rest
  } = props
  const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
  const { theme, components } = useSetupTheme({ componentContainer, baseTheme })
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
      {...rest}
      className={classnames(
        componentStyles.rootButton,
        { [componentStyles.focus]: focusVisible },
        { [componentStyles.disabled]: disabled },
        { [componentStyles.active]: active },
        { [componentStyles.startAdornment]: startAdornment },
        { [componentStyles.endAdornment]: endAdornment },
        { [componentStyles[variant]]: variant && variant !== 'default' },
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
