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
    listboxOpen = false,
    size = 'default',
    onListboxOpenChange,
    ...rest
  }: SelectProps<T>,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>
) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [listboxVisible, setListboxVisible] = React.useState(listboxOpen)
  const { getButtonProps, getListboxProps, value, contextValue, open } = useSelect<T>({
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    value: valueProp,
    ...rest
  })

  const onPopupBlur = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const isPopupBlur = !event.currentTarget.contains(event.relatedTarget)
      timeoutRef.current = setTimeout(() => {
        if (isPopupBlur && listboxVisible) {
          setListboxVisible(false)
        }
      }, 100)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    },
    [listboxVisible]
  )

  React.useEffect(() => {
    if (onListboxOpenChange) {
      onListboxOpenChange(listboxVisible)
    }
  }, [onListboxOpenChange, listboxVisible])

  React.useEffect(() => {
    setListboxVisible(listboxOpen)
  }, [listboxOpen])

  React.useEffect(() => {
    setListboxVisible(false)
  }, [value])

  const listbox = getListboxProps()
  // Prevent a weird behavior when select is nested in another select
  listbox.onBlur = () => {}

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
        listbox,
        popper: {
          className: classNames(
            componentStyles.popper,
            { [componentStyles[size]]: size && size !== 'default' },
            slotProps?.popper != null && 'className' in slotProps.popper && slotProps?.popper?.className
          ),
          onBlur: onPopupBlur,
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
