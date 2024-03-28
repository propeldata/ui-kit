import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { Select as MUISelect, SelectProps as MUISelectProps } from '@mui/base/Select'
import { SelectOptionDefinition, useSelect } from '@mui/base/useSelect'
import { prepareForSlot } from '@mui/base/utils'
import classNames from 'classnames'
import * as React from 'react'
import { Button, ButtonProps } from '../Button'
import { ChevronDownIcon } from '../Icons/ChevronDown'
import { Option } from './Option'
import componentStyles from './Select.module.scss'

export interface SelectProps
  extends Pick<ButtonProps, 'startAdornment' | 'endAdornment'>,
    MUISelectProps<string, false> {
  options?: SelectOptionDefinition<string>[]
}
// interface SelectProps
//   extends Pick<ButtonProps, 'startAdornment' | 'endAdornment'>,
//     Pick<SelectOwnProps<string, false>, 'onChange' | 'value' | 'children'> {
//   options?: SelectOptionDefinition<string>[]
//   // children?: React.ReactNode | React.ReactNode[]
//   placeholder?: string
//   // value?: string
// }

const ButtonSlot = prepareForSlot(Button)

export const Select = ({
  options,
  startAdornment,
  endAdornment = () => <ChevronDownIcon size={18} />,
  value: valueProp = undefined,
  children,
  className,
  slotProps,
  listboxOpen,
  ...rest
}: SelectProps) => {
  const [listboxVisible, setListboxVisible] = React.useState(listboxOpen ?? false)
  const { getButtonProps, value, open } = useSelect<string, false>({
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    value: valueProp,
    ...rest
  })

  React.useEffect(() => {
    setListboxVisible(listboxOpen ?? false)
  }, [listboxOpen])

  React.useEffect(() => {
    setListboxVisible(false)
  }, [value])

  return (
    <ClickAwayListener onClickAway={() => setListboxVisible(false)}>
      <MUISelect
        value={value}
        className={classNames(componentStyles.rootSelect, className)}
        {...rest}
        slots={{ root: ButtonSlot }}
        slotProps={{
          root: getButtonProps({ startAdornment, endAdornment, value: value ?? undefined }),
          popper: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            className: classNames(componentStyles.popper, slotProps?.popper?.className),
            disablePortal: true,
            open
          }
        }}
      >
        {children && !options && children}
        {options?.map((option, idx) => (
          <Option key={idx} {...option}>
            {option.label}
          </Option>
        ))}
      </MUISelect>
    </ClickAwayListener>
  )
}
