export type ThemeProps = {
  chartJsInitiated?: boolean
  baseTheme?: 'lightTheme' | 'darkTheme'

  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  lineHeight?: string

  tinyFontSize?: string
  tinyFontWeight?: string
  tinyLineHeight?: string

  h1FontSize?: string
  h1FontWeight?: string
  h1LineHeight?: string

  spaceXxs?: string
  spaceXs?: string

  componentHeight?: string
  successPrimary?: string
  successSecondary?: string
  errorPrimary?: string
  errorSecondary?: string

  colorPrimary?: string
  bgPrimary?: string
  bgSecondary?: string
  textPrimary?: string
  textSecondary?: string
  borderPrimary?: string
  accent?: string
  accentHover?: string
  colorGradient?: string
}
