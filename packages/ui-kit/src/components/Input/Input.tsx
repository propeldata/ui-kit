import { useInput } from '@mui/base/useInput'
import classnames from 'classnames'
import * as React from 'react'
import { ThemeAppearances } from 'src/themes'
import { useCombinedRefsCallback } from '../../helpers'
import { ThemeStateProps, useSetupTheme } from '../ThemeProvider'
import componentStyles from './Input.module.scss'

export interface InputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  size?: 'default' | 'small'
  appearance?: ThemeAppearances
  error?: boolean
  startAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
  endAdornment?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const {
    appearance = 'light',
    className,
    disabled = false,
    error,
    startAdornment,
    endAdornment,
    size = 'default',
    style,
    ...rest
  } = props
  const innerRef = React.useRef<HTMLInputElement>(null)
  const { componentContainer, setRef, ref } = useCombinedRefsCallback({ forwardedRef, innerRef })
  const { theme } = useSetupTheme({ componentContainer, appearance })
  const { getRootProps, getInputProps, focused } = useInput(props)

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      {...getRootProps({ style })}
      onClick={() => ref.current?.focus()}
      className={classnames(
        componentStyles.rootInput,
        {
          [componentStyles.error]: error,
          [componentStyles.focus]: focused,
          [componentStyles.disabled]: disabled,
          [componentStyles[size]]: size && size !== 'default'
        },
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
