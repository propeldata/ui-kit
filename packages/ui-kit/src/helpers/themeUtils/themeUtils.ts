import type { ThemeTokenProps } from '../../themes/theme.types'
import { themeTokens } from '../../themes/themeTokens'
import { camelCaseToKebabCase } from '../camelCaseToKebabCase'

const themeDict = themeTokens.map((themeToken) => ({
  name: themeToken,
  cssVarName: `--propel-${camelCaseToKebabCase(themeToken)}`
}))

/**
 * Parses the computed style of a given HTML element and extracts theme-related properties.
 * It maps CSS variable names to their corresponding theme token names and retrieves their values.
 * This is useful for dynamically reading the current theme values from an element.
 *
 * @param {HTMLElement} themeContainer - The HTML element from which to parse the theme.
 * @returns {Partial<ThemeTokenProps>} An object containing the theme properties and their values.
 */
export const parseComputedStyle = (themeContainer: HTMLElement) => {
  const computedStyle = getComputedStyle(themeContainer)
  const theme: Partial<ThemeTokenProps> = {}

  themeDict.forEach((item) => {
    const cssVarValue = computedStyle.getPropertyValue(item.cssVarName)
    if (cssVarValue) {
      Object.assign(theme, { [item.name]: cssVarValue })
    }
  })
  return theme
}

/**
 * Clears the style of a given HTML element by resetting theme-related CSS variables.
 * It iterates over a predefined list of theme tokens and removes their values from the element.
 * This function is used to reset the theme styling of an element to its default state.
 *
 * @param {HTMLElement} themeContainer - The HTML element whose style is to be cleared.
 */
export const clearContainerStyle = (themeContainer: HTMLElement) => {
  themeDict.forEach((item) => {
    themeContainer.style.setProperty(item.cssVarName, '')
  })
}

/**
 * Applies a theme to a given HTML element by setting theme-related CSS variables.
 * It iterates over a predefined list of theme tokens and assigns their corresponding values from the provided theme object.
 * This function is used to dynamically apply a theme to an element.
 *
 * @param {HTMLElement} themeContainer - The HTML element to which the theme is to be applied.
 * @param {ThemeTokenProps} theme - An object containing the theme properties and their values to be applied.
 */
export const setContainerStyle = (themeContainer: HTMLElement, theme: ThemeTokenProps) => {
  themeDict.forEach((item) => {
    const themePropValue = theme[item.name]?.toString()
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}
