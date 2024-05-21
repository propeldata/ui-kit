import { Option as MUIOption, OptionProps as MUIOptionProps } from '@mui/base/Option'
import classnames from 'classnames'
import * as React from 'react'
import componentStyles from './Option.module.scss'

export type OptionValue = {
  label?: string
  value: string | number
}

export type OptionProps<T extends OptionValue> = MUIOptionProps<T>

export const Option = React.forwardRef(
  ({ className, ...rest }: OptionProps<OptionValue>, forwardedRef: React.Ref<HTMLLIElement>) => (
    <MUIOption ref={forwardedRef} {...rest} className={classnames(componentStyles.rootOption, className)} />
  )
)

Option.displayName = 'Option'
