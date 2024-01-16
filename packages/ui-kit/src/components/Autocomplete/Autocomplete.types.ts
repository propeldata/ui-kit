import { CSSProperties } from 'react'
import { UseAutocompleteProps } from '@mui/base/useAutocomplete'

export interface AutocompleteOption {
  label: string
  [x: string | number | symbol]: unknown
}

export interface AutocompleteProps extends UseAutocompleteProps<string | AutocompleteOption, false, false, boolean> {
  placeholder?: string

  /** Styles to be applied to the container element */
  containerStyle?: CSSProperties

  /** If true, enables the user to type an arbitrary value */
  freeSolo?: boolean
}
