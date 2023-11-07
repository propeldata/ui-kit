export type ThemePropValues =
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'fontHeight'
  | 'bgPrimary'
  | 'bgSecondary'
  | 'textPrimary'
  | 'textSecondary'
  | 'borderPrimary'
  | 'accent'
  | 'accentHover'

export type ThemeProps = {
  chartJsInitiated?: boolean
  themeClassName?: string
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  fontHeight?: string
  bgPrimary?: string
  bgSecondary?: string
  textPrimary?: string
  textSecondary?: string
  borderPrimary?: string
  accent?: string
  accentHover?: string
}
