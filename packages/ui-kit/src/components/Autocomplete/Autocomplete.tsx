import { Button } from '@mui/base/Button'
import { Popper } from '@mui/base/Popper'
import { useAutocomplete, UseAutocompleteProps } from '@mui/base/useAutocomplete'
import { unstable_useForkRef as useForkRef } from '@mui/utils'
import * as React from 'react'
import classnames from 'classnames'
import componentStyles from './Autocomplete.module.scss'

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12.5L10 7.5L15 12.5"
      stroke="#667085"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="#667085"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// See full Autocomplete example here: https://mui.com/base-ui/react-autocomplete/#introduction
export const Autocomplete = React.forwardRef(function Autocomplete(
  //   props: UseAutocompleteProps<(typeof top100Films)[number], false, false, false>,
  props: UseAutocompleteProps<any[number], false, false, false>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { disableClearable = false, disabled = false, readOnly = false, ...other } = props

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getListboxProps,
    getOptionProps,
    dirty,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions
  } = useAutocomplete({
    ...props,
    componentName: 'BaseAutocompleteIntroduction'
  })

  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly

  const rootRef = useForkRef(ref, setAnchorEl)

  return (
    <React.Fragment>
      <div
        {...getRootProps(other)}
        ref={rootRef}
        className={classnames(componentStyles.rootAutocomplete, focused && 'focused')}
      >
        <input
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          {...getInputProps()}
          className={componentStyles.autocompleteInput}
        />
        <Button {...getPopupIndicatorProps()} className={componentStyles.autocompleteIndicator}>
          {popupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {anchorEl ? (
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          slots={{
            root: 'div'
          }}
          modifiers={[
            { name: 'flip', enabled: false },
            { name: 'preventOverflow', enabled: false }
          ]}
          disablePortal
        >
          <ul {...getListboxProps()} className={componentStyles.autocompleteList}>
            {(groupedOptions as any).map((option: any, index: any) => {
              const optionProps = getOptionProps({ option, index })

              return (
                <li key={index} {...optionProps}>
                  {option.label}
                </li>
              )
            })}

            {groupedOptions.length === 0 && <li>No results</li>}
          </ul>
        </Popper>
      ) : null}
    </React.Fragment>
  )
})
