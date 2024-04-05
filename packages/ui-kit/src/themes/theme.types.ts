import { CSSProperties } from 'react'
import type { DefaultThemes } from '../components/ThemeProvider/ThemeProvider.types'
import { ThemeTokenGeneratedProps, ThemeCSSTokenGeneratedProps } from './generated/theme.types'

export interface ThemeTokenProps extends ThemeTokenGeneratedProps {
  baseTheme?: DefaultThemes

  /** @deprecated This property is deprecated, use `textMdRegularFontFamily` instead */
  fontFamily?: CSSProperties['fontFamily']
  /** @deprecated This property is deprecated, use `textMdRegularFontSize` instead */
  fontSize?: CSSProperties['fontSize']
  /** @deprecated This property is deprecated, use `textMdRegularFontWeight` instead */
  fontWeight?: CSSProperties['fontWeight']
  /** @deprecated This property is deprecated, use `textMdRegularLineHeight` instead */
  lineHeight?: CSSProperties['lineHeight']

  /** @deprecated This property is deprecated, use `textXxsRegularFontFamily` instead */
  tinyFontFamily?: CSSProperties['fontFamily']
  /** @deprecated This property is deprecated, use `textXxsRegularFontSize` instead */
  tinyFontSize?: CSSProperties['fontSize']
  /** @deprecated This property is deprecated, use `textXxsRegularFontWeight` instead */
  tinyFontWeight?: CSSProperties['fontWeight']
  /** @deprecated This property is deprecated, use `textXxsRegularLineHeight` instead */
  tinyLineHeight?: CSSProperties['lineHeight']

  /** @deprecated This property is deprecated, use `textXsRegularFontFamily` instead */
  smallFontFamily?: CSSProperties['fontFamily']
  /** @deprecated This property is deprecated, use `textXsRegularFontSize` instead */
  smallFontSize?: CSSProperties['fontSize']
  /** @deprecated This property is deprecated, use `textXsRegularFontWeight` instead */
  smallFontWeight?: CSSProperties['fontWeight']
  /** @deprecated This property is deprecated, use `textXsRegularLineHeight` instead */
  smallLineHeight?: CSSProperties['lineHeight']

  /** @deprecated This property will be deprecated soon */
  h1FontFamily?: CSSProperties['fontFamily']
  /** @deprecated This property will be deprecated soon */
  h1FontSize?: CSSProperties['fontSize']
  /** @deprecated This property will be deprecated soon */
  h1FontWeight?: CSSProperties['fontWeight']
  /** @deprecated This property will be deprecated soon */
  h1LineHeight?: CSSProperties['lineHeight']

  /** @deprecated This property is deprecated, use `spacingXxs` instead */
  spaceXxs?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `spacingXs` instead */
  spaceXs?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `spacingSm` instead */
  spaceSm?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `spacingMd` instead */
  spaceMd?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `spacingLg` instead */
  spaceLg?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `spacingXl` instead */
  spaceXl?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `spacing2xl` instead */
  spaceXxl?: CSSProperties['margin']

  /** @deprecated This property is deprecated, use `radiusXs` instead */
  borderRadiusXs?: CSSProperties['borderRadius']
  /** @deprecated This property is deprecated, use `radiusSm` instead */
  borderRadiusSm?: CSSProperties['borderRadius']
  /** @deprecated This property is deprecated, use `shadowsShadowXs` instead */
  shadowSm?: CSSProperties['boxShadow']

  /** @deprecated This property will be deprecated soon */
  componentHeight?: CSSProperties['height']

  /** @deprecated This property will be deprecated soon */
  successPrimary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  successSecondary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  errorPrimary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  errorSecondary?: CSSProperties['color']

  /** @deprecated This property will be deprecated soon */
  colorPrimary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  colorSecondary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  bgPrimary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  bgSecondary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  textPrimary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  textSecondary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  borderPrimary?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  accent?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  accentHover?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  colorGradient?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  colorLoader?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
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
  /** @deprecated This property is deprecated, use `--propel-text-md-regular-font-family` instead */
  '--propel-font-family'?: CSSProperties['fontFamily']
  /** @deprecated This property is deprecated, use `--propel-text-md-regular-font-size` instead */
  '--propel-font-size'?: CSSProperties['fontSize']
  /** @deprecated This property is deprecated, use `--propel-text-md-regular-font-weight` instead */
  '--propel-font-weight'?: CSSProperties['fontWeight']
  /** @deprecated This property is deprecated, use `--propel-text-md-regular-line-height` instead */
  '--propel-line-height'?: CSSProperties['lineHeight']

  /** @deprecated This property is deprecated, use `--propel-text-xxs-regular-font-family` instead */
  '--propel-tiny-font-family'?: CSSProperties['fontFamily']
  /** @deprecated This property is deprecated, use `--propel-text-xxs-regular-font-size` instead */
  '--propel-tiny-font-size'?: CSSProperties['fontSize']
  /** @deprecated This property is deprecated, use `--propel-text-xxs-regular-font-weight` instead */
  '--propel-tiny-font-weight'?: CSSProperties['fontWeight']
  /** @deprecated This property is deprecated, use `--propel-text-xxs-regular-line-height` instead */
  '--propel-tiny-line-height'?: CSSProperties['lineHeight']

  /** @deprecated This property is deprecated, use `--propel-text-xs-regular-font-family` instead */
  '--propel-small-font-family'?: CSSProperties['fontFamily']
  /** @deprecated This property is deprecated, use `--propel-text-xs-regular-font-size` instead */
  '--propel-small-font-size'?: CSSProperties['fontSize']
  /** @deprecated This property is deprecated, use `--propel-text-xs-regular-font-weight` instead */
  '--propel-small-font-weight'?: CSSProperties['fontWeight']
  /** @deprecated This property is deprecated, use `--propel-text-xs-regular-line-height` instead */
  '--propel-small-line-height'?: CSSProperties['lineHeight']

  /** @deprecated This property will be deprecated soon */
  '--propel-h1-font-family'?: CSSProperties['fontFamily']
  /** @deprecated This property will be deprecated soon */
  '--propel-h1-font-size'?: CSSProperties['fontSize']
  /** @deprecated This property will be deprecated soon */
  '--propel-h1-font-weight'?: CSSProperties['fontWeight']
  /** @deprecated This property will be deprecated soon */
  '--propel-h1-line-height'?: CSSProperties['lineHeight']

  /** @deprecated This property is deprecated, use `--propel-spacing-xxs` instead */
  '--propel-space-xxs'?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `--propel-spacing-xs` instead */
  '--propel-space-xs'?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `--propel-spacing-sm` instead */
  '--propel-space-sm'?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `--propel-spacing-md` instead */
  '--propel-space-md'?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `--propel-spacing-lg` instead */
  '--propel-space-lg'?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `--propel-spacing-xl` instead */
  '--propel-space-xl'?: CSSProperties['margin']
  /** @deprecated This property is deprecated, use `--propel-spacing-2xl` instead */
  '--propel-space-xxl'?: CSSProperties['margin']

  /** @deprecated This property is deprecated, use `radiusXs` instead */
  '--propel-border-radius-xs'?: CSSProperties['borderRadius']
  /** @deprecated This property is deprecated, use `radiusSm` instead */
  '--propel-border-radius-sm'?: CSSProperties['borderRadius']
  /** @deprecated This property is deprecated, use `shadowsShadowXs` instead */
  '--propel-shadow-sm'?: CSSProperties['boxShadow']

  '--propel-component-height'?: CSSProperties['height']

  /** @deprecated This property is deprecated */
  '--propel-success-primary'?: CSSProperties['color']
  /** @deprecated This property is deprecated */
  '--propel-success-secondary'?: CSSProperties['color']
  /** @deprecated This property is deprecated */
  '--propel-error-primary'?: CSSProperties['color']
  /** @deprecated This property is deprecated */
  '--propel-error-secondary'?: CSSProperties['color']

  /** @deprecated This property will be deprecated soon */
  '--propel-color-primary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-color-secondary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-bg-primary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-bg-secondary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-text-primary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-text-secondary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  /** @deprecated This property will be deprecated soon */
  '--propel-border-primary'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-accent'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-accent-hover'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-color-gradient'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
  '--propel-color-loader'?: CSSProperties['color']
  /** @deprecated This property will be deprecated soon */
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
