import { Option as MUIOption } from '@mui/base/Option'
import classnames from 'classnames'
import * as React from 'react'
import { useForwardedRefCallback } from '../../../helpers'
import { DefaultThemes, useSetupTheme } from '../../ThemeProvider'
import componentStyles from './Option.module.scss'

type OptionValue = string | number

export interface OptionProps extends React.ComponentPropsWithoutRef<'li'> {
  disabled?: boolean
  baseTheme?: DefaultThemes
  value: OptionValue
}

export const Option = React.forwardRef<HTMLLIElement, OptionProps>(({ className, ...rest }, ref) => {
  const { componentContainer, setRef } = useForwardedRefCallback(ref)
  useSetupTheme({ componentContainer, baseTheme: rest.baseTheme })

  return (
    <MUIOption<OptionValue, typeof Option>
      ref={setRef}
      {...rest}
      className={classnames(componentStyles.rootOption, className)}
    />
  )
})

Option.displayName = 'Option'
