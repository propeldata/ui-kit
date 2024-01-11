import { Button } from '@mui/base/Button'
import { Popper } from '@mui/base/Popper'
import { useAutocomplete, UseAutocompleteProps } from '@mui/base/useAutocomplete'
import { unstable_useForkRef as useForkRef } from '@mui/utils'
import * as React from 'react'
import classnames from 'classnames'
import componentStyles from './Autocomplete.module.scss'

// There is an issue with MUI icons: https://stackoverflow.com/a/71806305/311327
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ClearIcon from '@mui/icons-material/Clear'

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
    getClearProps,
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
        {hasClearIcon && <Button {...getClearProps()}>{/* <ClearIcon /> */}x</Button>}
        <Button {...getPopupIndicatorProps()} className={popupOpen ? 'popupOpen' : undefined}>
          \/
          {/* <ArrowDropDownIcon /> */}
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
