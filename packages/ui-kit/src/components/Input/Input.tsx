import { InputProps as MUIInputProps } from '@mui/base/Input'
import { useInput } from '@mui/base/useInput'
import classnames from 'classnames'
import * as React from 'react'
import { useCombinedRefsCallback } from '../../helpers'
import { DefaultThemes, ThemeStateProps, useSetupTheme } from '../ThemeProvider'
import componentStyles from './Input.module.scss'

export interface InputProps extends Omit<MUIInputProps, 'startAdornment' | 'endAdornment'> {
  size?: 'small' | 'default'
  baseTheme?: DefaultThemes
  error?: boolean
  startAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
  endAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const {
    baseTheme,
    className,
    disabled,
    error,
    startAdornment,
    endAdornment,
    size = 'default',
    style,
    ...rest
  } = props
  const innerRef = React.useRef<HTMLInputElement>(null)
  const { componentContainer, setRef, ref } = useCombinedRefsCallback({ forwardedRef, innerRef })
  const { theme } = useSetupTheme({ componentContainer, baseTheme })
  const { getRootProps, getInputProps, focused } = useInput(props)

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      {...getRootProps({ style })}
      onClick={() => ref.current?.focus()}
      className={classnames(
        componentStyles.rootInput,
        componentStyles[size],
        { [componentStyles.error]: error },
        { [componentStyles.focus]: focused },
        { [componentStyles.disabled]: disabled },
        className
      )}
    >
      {startAdornment && startAdornment({ theme })}
      <input {...getInputProps({ ...rest })} ref={setRef} />
      {endAdornment && endAdornment({ theme })}
    </div>
  )
})

Input.displayName = 'Input'
