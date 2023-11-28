import type { ThemeTokenProps } from '../themes/theme.types'
import { themeTokens } from '../themes/themeTokens'
import { camelCaseToKebabCase } from './camelCaseToKebabCase'

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
