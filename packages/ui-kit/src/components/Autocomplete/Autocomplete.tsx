import { Button } from '@mui/base/Button'
import { Popper } from '@mui/base/Popper'
import { Input } from '@mui/base/Input'
import { useAutocomplete } from '@mui/base/useAutocomplete'
import * as React from 'react'
import classnames from 'classnames'
import componentStyles from './Autocomplete.module.scss'
import { useCombinedRefs } from '../../helpers'
import { AutocompleteProps } from './Autocomplete.types'

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
  props: AutocompleteProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { disabled = false, readOnly = false, placeholder = '', ...other } = props

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getListboxProps,
    getOptionProps,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions
  } = useAutocomplete({
    ...props,
    componentName: 'Autocomplete'
  })

  const rootRef = useCombinedRefs(ref, setAnchorEl)

  console.log(groupedOptions)

  return (
    <React.Fragment>
      <div
        {...getRootProps(other)}
        ref={rootRef}
        className={classnames(componentStyles.rootAutocomplete, focused && componentStyles.rootAutocomplete__focused)}
      >
        <Input
          id={id}
          ref={setAnchorEl}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          slotProps={{
            input: {
              className: componentStyles.autocompleteInput,
              ...getInputProps()
            }
          }}
          style={{ width: '100%' }}
        />
        <Button
          {...getPopupIndicatorProps()}
          name="autocomplete-button"
          aria-label="dropdown-button"
          className={componentStyles.autocompleteIndicator}
        >
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
            {groupedOptions.map((option, index) => {
              if ('label' in option) {
                const optionProps = getOptionProps({ option, index })

                return (
                  <li key={index} {...optionProps}>
                    {option.label}
                  </li>
                )
              }
            })}
            {groupedOptions.length === 0 && <li>No results</li>}
          </ul>
        </Popper>
      ) : null}
    </React.Fragment>
  )
})
