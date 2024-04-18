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
  extends Pick<ButtonProps, 'startAdornment' | 'endAdornment' | 'size'>,
    MUISelectProps<string, false> {
  options?: SelectOptionDefinition<string>[]
}

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
  size = 'default',
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
          root: getButtonProps({
            startAdornment,
            endAdornment,
            size,
            value: value ?? undefined,
            className: classNames(componentStyles.button, componentStyles.rootButton, {
              [componentStyles[size]]: size && size !== 'default'
            })
          }),
          popper: {
            className: classNames(
              componentStyles.popper,
              { [componentStyles[size]]: size && size !== 'default' },
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              slotProps?.popper?.className
            ),
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