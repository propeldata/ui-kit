import { UseAutocompleteProps } from '@mui/base/useAutocomplete'

export interface AutocompleteOption {
  label?: string
}

export interface AutocompleteProps extends UseAutocompleteProps<AutocompleteOption, false, false, false> {
  placeholder?: string
}
