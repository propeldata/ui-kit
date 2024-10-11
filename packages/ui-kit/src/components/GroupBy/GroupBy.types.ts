import { ThemeSettingProps } from '../../themes'
import { SelectProps } from '../Select'
import { DataComponentProps, QueryProps } from '../shared.types'

export interface GroupByQueryProps extends QueryProps {
  /** Data pool to fetch columns from */
  dataPool?: {
    id?: string
    name?: string
  }
}

export interface GroupByProps
  extends ThemeSettingProps,
    Omit<
      DataComponentProps<'span'>,
      'card' | 'errorFallback' | 'renderEmpty' | 'renderLoader' | 'loaderProps' | 'value' | 'defaultValue'
    > {
  /** Props that the select input will receive */
  selectProps?: Omit<SelectProps<{ label: string; value: string }>, 'options' | 'disableClearable'>

  /** Columns to group by for static mode, if passed, the component will ignore the built-in GraphQL operations */
  columns?: string[]

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** GroupBy query props */
  query?: GroupByQueryProps
}
