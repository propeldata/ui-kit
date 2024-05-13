import { Select as MUISelect, SelectProps as MUISelectProps } from '@mui/base/Select'
import { SelectOptionDefinition, SelectProvider, useSelect } from '@mui/base/useSelect'
import { prepareForSlot } from '@mui/base/utils'
import classNames from 'classnames'
import * as React from 'react'
import { Button, ButtonProps } from '../Button'
import { ChevronDownIcon } from '../Icons/ChevronDown'
import { Option, OptionValue } from './Option'
import componentStyles from './Select.module.scss'

export interface SelectProps<T extends OptionValue>
  extends Pick<ButtonProps, 'startAdornment' | 'endAdornment' | 'size'>,
    MUISelectProps<T, false> {
  options?: SelectOptionDefinition<T>[]
}

const ButtonSlot = prepareForSlot(Button)

const SelectComponent = <T extends OptionValue>(
  {
    options,
    startAdornment,
    endAdornment = () => <ChevronDownIcon size={18} />,
    value: valueProp,
    children,
    className,
    slotProps,
    listboxOpen,
    size = 'default',
    onListboxOpenChange,
    ...rest
  }: SelectProps<T>,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>
) => {
  const [listboxVisible, setListboxVisible] = React.useState(listboxOpen ?? false)
  const { getButtonProps, getListboxProps, value, contextValue, open } = useSelect<T>({
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    value: valueProp,
    ...rest
  })

  React.useEffect(() => {
    if (onListboxOpenChange) {
      onListboxOpenChange(listboxVisible)
    }
  }, [onListboxOpenChange, listboxVisible])

  React.useEffect(() => {
    setListboxVisible(listboxOpen ?? false)
  }, [listboxOpen])

  React.useEffect(() => {
    setListboxVisible(false)
  }, [value])

  return (
    <MUISelect<T, false>
      ref={forwardedRef}
      value={value}
      className={classNames(componentStyles.rootSelect, className)}
      {...rest}
      slots={{ root: ButtonSlot }}
      slotProps={{
        root: getButtonProps({
          startAdornment,
          endAdornment,
          size,
          value: value?.label ?? undefined,
          className: classNames(componentStyles.button, componentStyles.rootButton, {
            [componentStyles[size]]: size && size !== 'default'
          })
        }),
        listbox: getListboxProps(),
        popper: {
          className: classNames(
            componentStyles.popper,
            { [componentStyles[size]]: size && size !== 'default' },
            slotProps?.popper != null && 'className' in slotProps.popper && slotProps?.popper?.className
          ),
          disablePortal: true,
          open
        }
      }}
    >
      <SelectProvider value={contextValue}>
        {children && !options && children}
        {options?.map((option, idx) => (
          <Option key={idx} {...option}>
            {option.label}
          </Option>
        ))}
      </SelectProvider>
    </MUISelect>
  )
}

SelectComponent.displayName = 'Select'

export const Select = React.forwardRef(SelectComponent) as <T extends OptionValue>(
  props: SelectProps<T> & React.RefAttributes<HTMLButtonElement>
) => JSX.Element
