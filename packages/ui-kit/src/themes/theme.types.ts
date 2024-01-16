import { CSSProperties } from 'react'
import type { DefaultThemes } from '../components/ThemeProvider/ThemeProvider.types'
import { ThemeTokenGeneratedProps, ThemeCSSTokenGeneratedProps } from './generated/theme.types'

export interface ThemeTokenProps extends ThemeTokenGeneratedProps {
  baseTheme?: DefaultThemes

  fontFamily?: CSSProperties['fontFamily']
  fontSize?: CSSProperties['fontSize']
  fontWeight?: CSSProperties['fontWeight']
  lineHeight?: CSSProperties['lineHeight']

  tinyFontFamily?: CSSProperties['fontFamily']
  tinyFontSize?: CSSProperties['fontSize']
  tinyFontWeight?: CSSProperties['fontWeight']
  tinyLineHeight?: CSSProperties['lineHeight']

  smallFontFamily?: CSSProperties['fontFamily']
  smallFontSize?: CSSProperties['fontSize']
  smallFontWeight?: CSSProperties['fontWeight']
  smallLineHeight?: CSSProperties['lineHeight']

  h1FontFamily?: CSSProperties['fontFamily']
  h1FontSize?: CSSProperties['fontSize']
  h1FontWeight?: CSSProperties['fontWeight']
  h1LineHeight?: CSSProperties['lineHeight']

  spaceXxs?: CSSProperties['margin']
  spaceXs?: CSSProperties['margin']
  spaceSm?: CSSProperties['margin']
  spaceMd?: CSSProperties['margin']
  spaceLg?: CSSProperties['margin']
  spaceXl?: CSSProperties['margin']
  spaceXxl?: CSSProperties['margin']

  borderRadiusXs?: CSSProperties['borderRadius']
  borderRadiusSm?: CSSProperties['borderRadius']
  shadowSm?: CSSProperties['boxShadow']

  componentHeight?: CSSProperties['height']

  successPrimary?: CSSProperties['color']
  successSecondary?: CSSProperties['color']
  errorPrimary?: CSSProperties['color']
  errorSecondary?: CSSProperties['color']

  colorPrimary?: CSSProperties['color']
  colorSecondary?: CSSProperties['color']
  bgPrimary?: CSSProperties['color']
  bgSecondary?: CSSProperties['color']
  textPrimary?: CSSProperties['color']
  textSecondary?: CSSProperties['color']
  borderPrimary?: CSSProperties['color']
  accent?: CSSProperties['color']
  accentHover?: CSSProperties['color']
  colorGradient?: CSSProperties['color']
  colorLoader?: CSSProperties['color']
  colorLoaderAnimation?: CSSProperties['color']

  /**
   * Color Blue
   */
  colorBlue950?: CSSProperties['color']
  colorBlue900?: CSSProperties['color']
  colorBlue800?: CSSProperties['color']
  colorBlue700?: CSSProperties['color']
  colorBlue600?: CSSProperties['color']
  colorBlue500?: CSSProperties['color']
  colorBlue400?: CSSProperties['color']
  colorBlue300?: CSSProperties['color']
  colorBlue200?: CSSProperties['color']
  colorBlue100?: CSSProperties['color']
  colorBlue50?: CSSProperties['color']
  colorBlue25?: CSSProperties['color']
}

export interface ThemeCSSTokenProps extends ThemeCSSTokenGeneratedProps {
  '--propel-font-family'?: CSSProperties['fontFamily']
  '--propel-font-size'?: CSSProperties['fontSize']
  '--propel-font-weight'?: CSSProperties['fontWeight']
  '--propel-line-height'?: CSSProperties['lineHeight']

  '--propel-tiny-font-family'?: CSSProperties['fontFamily']
  '--propel-tiny-font-size'?: CSSProperties['fontSize']
  '--propel-tiny-font-weight'?: CSSProperties['fontWeight']
  '--propel-tiny-line-height'?: CSSProperties['lineHeight']

  '--propel-small-font-family'?: CSSProperties['fontFamily']
  '--propel-small-font-size'?: CSSProperties['fontSize']
  '--propel-small-font-weight'?: CSSProperties['fontWeight']
  '--propel-small-line-height'?: CSSProperties['lineHeight']

  '--propel-h1-font-family'?: CSSProperties['fontFamily']
  '--propel-h1-font-size'?: CSSProperties['fontSize']
  '--propel-h1-font-weight'?: CSSProperties['fontWeight']
  '--propel-h1-line-height'?: CSSProperties['lineHeight']

  '--propel-space-xxs'?: CSSProperties['margin']
  '--propel-space-xs'?: CSSProperties['margin']
  '--propel-space-sm'?: CSSProperties['margin']
  '--propel-space-md'?: CSSProperties['margin']
  '--propel-space-lg'?: CSSProperties['margin']
  '--propel-space-xl'?: CSSProperties['margin']
  '--propel-space-xxl'?: CSSProperties['margin']

  '--propel-border-radius-xs'?: CSSProperties['borderRadius']
  '--propel-border-radius-sm'?: CSSProperties['borderRadius']

  '--propel-shadow-sm'?: CSSProperties['boxShadow']

  '--propel-component-height'?: CSSProperties['height']

  '--propel-success-primary'?: CSSProperties['color']
  '--propel-success-secondary'?: CSSProperties['color']
  '--propel-error-primary'?: CSSProperties['color']
  '--propel-error-secondary'?: CSSProperties['color']
  '--propel-color-primary'?: CSSProperties['color']
  '--propel-color-secondary'?: CSSProperties['color']
  '--propel-bg-primary'?: CSSProperties['color']
  '--propel-bg-secondary'?: CSSProperties['color']
  '--propel-text-primary'?: CSSProperties['color']
  '--propel-text-secondary'?: CSSProperties['color']
  '--propel-border-primary'?: CSSProperties['color']
  '--propel-accent'?: CSSProperties['color']
  '--propel-accent-hover'?: CSSProperties['color']
  '--propel-color-gradient'?: CSSProperties['color']
  '--propel-color-loader'?: CSSProperties['color']
  '--propel-color-loader-animation'?: CSSProperties['color']

  '--propel-color-blue950'?: CSSProperties['color']
  '--propel-color-blue900'?: CSSProperties['color']
  '--propel-color-blue800'?: CSSProperties['color']
  '--propel-color-blue700'?: CSSProperties['color']
  '--propel-color-blue600'?: CSSProperties['color']
  '--propel-color-blue500'?: CSSProperties['color']
  '--propel-color-blue400'?: CSSProperties['color']
  '--propel-color-blue300'?: CSSProperties['color']
  '--propel-color-blue200'?: CSSProperties['color']
  '--propel-color-blue100'?: CSSProperties['color']
  '--propel-color-blue50'?: CSSProperties['color']
  '--propel-color-blue25'?: CSSProperties['color']
}

/**
 * This type is used to extend the React.CSSProperties type with the CSS variables defined in the theme.
 */
export interface ThemeCSSProperties extends React.CSSProperties, ThemeCSSTokenProps {}

export type ThemeComponentProps = {
  /** Supports all standard CSS properties along with custom theme-based CSS variables */
  style?: ThemeCSSProperties

  /** Provides a className for the ErrorFallback container */
  className?: string

  /** Base theme to be used */
  baseTheme?: DefaultThemes
}
