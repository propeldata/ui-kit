import type { ThemeTokenProps } from './theme.types'

export const themeTokens: (keyof ThemeTokenProps)[] = [
  // Typography - Base
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',

  // Typography - Tiny
  'tinyFontFamily',
  'tinyFontSize',
  'tinyFontWeight',
  'tinyLineHeight',

  // Typography - Small
  'smallFontFamily',
  'smallFontSize',
  'smallFontWeight',
  'smallLineHeight',

  // Typography - H1
  'h1FontFamily',
  'h1FontSize',
  'h1FontWeight',
  'h1LineHeight',

  // Spacing
  'spaceXxs',
  'spaceXs',
  'spaceSm',
  'spaceMd',
  'spaceLg',
  'spaceXl',
  'spaceXxl',

  // Borders
  'borderRadiusXs',
  'borderRadiusSm',

  // Shadows
  'shadowSm',

  // Utils
  'componentHeight',

  // Colors
  'successPrimary',
  'successSecondary',
  'errorPrimary',
  'errorSecondary',

  'colorPrimary',
  'colorSecondary',
  'bgPrimary',
  'bgSecondary',
  'textPrimary',
  'textSecondary',
  'borderPrimary',
  'accent',
  'accentHover',
  'colorGradient'
]
