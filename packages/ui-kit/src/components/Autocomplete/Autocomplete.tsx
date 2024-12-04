'use client'

import { Button } from '@mui/base/Button'
import { Input } from '@mui/base/Input'
import { Popper } from '@mui/base/Popper'
import { useAutocomplete } from '@mui/base/useAutocomplete'
import classnames from 'classnames'
import * as React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { useParsedComponentProps } from '../../themes'
import { ChevronDownIcon } from '../Icons/ChevronDown'
import { ChevronUpIcon } from '../Icons/ChevronUp'
import { CloseIcon } from '../Icons/Close'
import { useSetupTheme } from '../ThemeProvider'
import componentStyles from './Autocomplete.module.scss'
import { AutocompleteOption, AutocompleteProps } from './Autocomplete.types'

// See full Autocomplete example here: https://mui.com/base-ui/react-autocomplete/#introduction
export const Autocomplete = React.forwardRef(function Autocomplete(
  props: AutocompleteProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    disabled = false,
    readOnly = false,
    placeholder = '',
    containerStyle,
    containerClassname,
    className,
    inputStyle,
    inputClassname,
    freeSolo = false,
    listStyle,
    listClassname,
    optionStyle,
    optionClassname,
    defaultOpen = false,
    disableClearable = false,
    ...rest
  } = props

  const inputContainerRef = React.useRef<HTMLDivElement>(null)

  const { themeSettings, parsedPropsWithoutRest } = useParsedComponentProps(props)

  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getListboxProps,
    getOptionProps,
    id,
    dirty,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions,
    getClearProps,
    value
  } = useAutocomplete({
    ...props,
    componentName: 'Autocomplete',
    freeSolo,
    selectOnFocus: true,
    getOptionLabel: (option) => {
      if (typeof option === 'string') {
        return option
      }
      if (option && option.label != null) {
        return option.label
      }
      if (option && option.value != null) {
        return option.value
      }
      return ''
    },
    blurOnSelect: true,
    open: isOpen
  })

  React.useEffect(() => {
    if (value) {
      setIsOpen(false)
    }
  }, [value])

  const { componentContainer, setRef } = useForwardedRefCallback(ref)

  useSetupTheme({
    componentContainer: componentContainer?.parentElement,
    ...themeSettings
  })

  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly

  return (
    <div {...parsedPropsWithoutRest} ref={setRef} className={className}>
      <div
        {...getRootProps(rest)}
        ref={inputContainerRef}
        className={classnames(
          componentStyles.rootAutocomplete,
          focused && componentStyles.rootAutocomplete__focused,
          containerClassname
        )}
        style={{ ...getRootProps(rest).style, ...containerStyle }}
      >
        <Input
          id={id}
          ref={setAnchorEl}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          slotProps={{
            input: {
              ...getInputProps(),
              className: classnames(
                ...(getInputProps().className ?? ''),
                componentStyles.autocompleteInput,
                inputClassname
              ),
              style: {
                ...getInputProps().style,
                ...inputStyle,
                width: '100%'
              },
              onFocus: () => {
                setIsOpen(true)
              },
              onBlur: () => {
                setIsOpen(false)
              }
            }
          }}
          style={{ width: '100%' }}
        />
        {hasClearIcon && (
          <button {...getClearProps()} className={componentStyles.clearButton}>
            <CloseIcon />
          </button>
        )}
        {props.options.length > 0 && (
          <Button
            {...getPopupIndicatorProps()}
            aria-label="dropdown-button"
            className={componentStyles.autocompleteIndicator}
          >
            {popupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        )}
      </div>
      {anchorEl && props.options.length > 0 && !(groupedOptions.length === 0 && freeSolo) ? (
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          popperOptions={{
            strategy: 'fixed'
          }}
          slots={{
            root: 'div'
          }}
          className={componentStyles.popper}
          modifiers={[
            { name: 'flip', enabled: false },
            { name: 'preventOverflow', enabled: false }
          ]}
          style={{
            width: 'fit-content',
            zIndex: 9999
          }}
          disablePortal
        >
          <ul
            {...getListboxProps()}
            className={classnames(
              componentStyles.autocompleteList,
              ...(getListboxProps().className ?? ''),
              listClassname
            )}
            style={{ ...getListboxProps().style, ...listStyle }}
          >
            {groupedOptions.map((option, index) => {
              let optionLabel: AutocompleteOption
              if (typeof option === 'string') optionLabel = { label: option }
              else optionLabel = { ...option }

              const optionProps = getOptionProps({ option: option as AutocompleteOption, index })

              return (
                <li
                  key={index}
                  {...optionProps}
                  onMouseMove={() => {}} // we need to override `onMouseMove` from `optionProps` to prevent elements being focused by hover
                  className={classnames(componentStyles.autoCompleteOption, optionProps.className, optionClassname)}
                  style={{ ...optionProps.style, ...optionStyle }}
                >
                  {optionLabel.label}
                </li>
              )
            })}
            {groupedOptions.length === 0 && <li>No results</li>}
          </ul>
        </Popper>
      ) : null}
    </div>
  )
})
