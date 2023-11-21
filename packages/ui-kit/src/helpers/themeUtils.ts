import type { ThemeTokenProps } from '../themes/theme.types'
import { camelCaseToKebabCase } from './camelCaseToKebabCase'

const themeTokens: (keyof ThemeTokenProps)[] = [
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

const themeDict = themeTokens.map((themeToken) => ({
  name: themeToken,
  cssVarName: `--propel-${camelCaseToKebabCase(themeToken)}`
}))

export const parseComputedStyle = (themeContainer: HTMLElement) => {
  const computedStyle = getComputedStyle(themeContainer)
  const theme: Partial<ThemeTokenProps> = {}

  themeDict.forEach((item) => {
    const cssVarValue = computedStyle.getPropertyValue(item.cssVarName)
    if (cssVarValue) {
      theme[item.name as string] = cssVarValue
    }
  })
  return theme
}

export const clearContainerStyle = (themeContainer: HTMLElement) => {
  themeDict.forEach((item) => {
    themeContainer.style.setProperty(item.cssVarName, '')
  })
}

export const setContainerStyle = (themeContainer: HTMLElement, theme: ThemeTokenProps) => {
  themeDict.forEach((item) => {
    const themePropValue = theme[item.name as string]
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}
