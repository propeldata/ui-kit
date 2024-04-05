import { UseSelectParameters } from '@mui/base'
import { CSSProperties } from 'react'

export interface OptionProps {
  /** Element that will be displayed in the component */
  children: React.ReactNode

  /** Classname that will be applied to option container */
  className?: string

  /** Value that will be used in the option */
  value: string

  /** If `true`, will show a checkbox before the label */
  checkbox?: boolean
}

export interface SelectProps extends Omit<UseSelectParameters<string, boolean>, 'options'> {
  /** A list of options with the possibility of adding additional elements */
  children?: React.ReactNode

  /** Placeholder to show when no value is selected */
  placeholder?: string

  /** Styles to be applied to the container element */
  containerStyle?: CSSProperties

  /** Classname that will be applied to the input container */
  containerClassname?: string
}
