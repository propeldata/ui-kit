import type { ThemeTokenProps } from './theme.types'
import { themeTokensGenerated } from './generated/themeTokens'

export const themeTokens: (keyof ThemeTokenProps)[] = [
  ...themeTokensGenerated,

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
  'colorGradient',
  'colorLoader',
  'colorLoaderAnimation',

  // Colors Blue
  'colorBlue950',
  'colorBlue900',
  'colorBlue800',
  'colorBlue700',
  'colorBlue600',
  'colorBlue500',
  'colorBlue400',
  'colorBlue300',
  'colorBlue200',
  'colorBlue100',
  'colorBlue50',
  'colorBlue25'
]
