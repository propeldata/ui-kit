import { CSSProperties } from 'react'
import { UseAutocompleteProps } from '@mui/base/useAutocomplete'
import { DropdownOption } from '../shared.types'

export interface AutocompleteProps extends UseAutocompleteProps<string | DropdownOption, false, false, boolean> {
  placeholder?: string

  /** Styles to be applied to the container element */
  containerStyle?: CSSProperties

  /** Classname that will be applied to the input container */
  containerClassname?: string

  /** Styles to be applied to the input element */
  inputStyle?: CSSProperties

  /** Classname that will be applied to the input element */
  inputClassname?: string

  /** Styles to be appled to the list element */
  listStyle?: CSSProperties

  /** Classname that will be applied to the list element */
  listClassname?: string

  /** Styles to be applied to the option element */
  optionStyle?: CSSProperties

  /** Classname that will be applied to the option element */
  optionClassname?: string

  /** If true, enables the user to type an arbitrary value */
  freeSolo?: boolean
}
