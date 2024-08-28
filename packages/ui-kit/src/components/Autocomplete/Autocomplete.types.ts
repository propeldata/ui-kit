import { UseAutocompleteProps } from '@mui/base/useAutocomplete'
import { CSSProperties } from 'react'
import { ThemeSettingProps } from '../../themes'

export interface AutocompleteOption {
  /** The display label */
  label?: string
  /** The value that will be used when the option is selected */
  value?: string
  [x: string | number | symbol]: unknown
}

export interface AutocompleteProps
  extends ThemeSettingProps,
    UseAutocompleteProps<string | AutocompleteOption, false, boolean, boolean> {
  className?: string
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
