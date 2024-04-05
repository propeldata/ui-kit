import * as React from 'react'
import { useSelect, SelectProvider } from '@mui/base/useSelect'
import { useOption } from '@mui/base/useOption'
import classnames from 'classnames'

import { OptionProps, SelectProps } from './Select.types'
import { DropdownOption } from '../shared.types'
import { ChevronDownIcon, ChevronUpIcon } from '../Icons'

import './Select.css'
import componentStyles from './Select.module.scss'

function renderSelectedValue(value: string | string[], options: DropdownOption[]) {
  if (typeof value === 'string') {
    const selectedOption = options.find((option) => option.value === value)

    return selectedOption?.label ?? selectedOption?.value ?? null
  }

  const selectedOptionsLabels = value.map(
    (optionValue) => options.find((option) => option.value === optionValue)?.label
  )

  return selectedOptionsLabels.join(', ')
}

export function Option(props: OptionProps) {
  const { children, value, className, checkbox = false } = props
  const { getRootProps, highlighted, selected } = useOption({
    value,
    label: children,
    disabled: false
  })

  return (
    <li
      {...getRootProps()}
      className={classnames({ highlighted }, componentStyles.CustomSelectIntroduction__option, className)}
    >
      {checkbox && <input type="checkbox" checked={selected} readOnly />}
      {children}
    </li>
  )
}

export function Select({ children, placeholder, multiple, containerClassname, containerStyle, ...rest }: SelectProps) {
  const listboxRef = React.useRef(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [listboxVisible, setListboxVisible] = React.useState(false)

  const options: DropdownOption[] = React.useMemo(
    () =>
      React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || child.type !== Option) return null

        const { value, children } = child.props

        const label = [...children]
          .filter((child: React.ReactElement) => typeof child === 'string')
          .join('')
          .trim()

        return { value, label }
      })?.filter((option) => option != null) ?? [],
    [children]
  )

  const { getButtonProps, getListboxProps, contextValue, disabled, value } = useSelect<string, boolean>({
    listboxRef,
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    multiple,
    buttonRef,
    ...rest
  })

  return (
    <div style={{ position: 'relative' }}>
      <button
        {...getButtonProps()}
        className={classnames(
          componentStyles.CustomSelectIntroduction,
          disabled && componentStyles.CustomSelectIntroduction__disabled,
          containerClassname
        )}
        style={containerStyle}
      >
        {renderSelectedValue(value ?? '', options) || (
          <span className={componentStyles.placeholder}>{placeholder ?? ' '}</span>
        )}
        <span
          className={classnames(
            componentStyles.CustomSelectIntroduction__indicator,
            disabled && componentStyles.hidden
          )}
          role="button"
        >
          {listboxVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>
      <ul
        {...getListboxProps()}
        aria-hidden={!listboxVisible}
        className={classnames(
          componentStyles.CustomSelectIntroduction__listbox,
          listboxVisible ? '' : componentStyles.hidden
        )}
        style={{ width: buttonRef?.current?.clientWidth }}
      >
        <SelectProvider value={contextValue}>{children}</SelectProvider>
      </ul>
    </div>
  )
}
