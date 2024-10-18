/**
 * Theme Utilities for ThemeProvider
 *
 * These functions are integral to the ThemeProvider's functionality in managing and applying styles within a React application.
 *
 * - parseComputedStyle(themeContainer: HTMLElement): This utility is used within the ThemeProvider to dynamically read
 *   the current theme-related styles from a specified HTML element. It extracts CSS variable values corresponding
 *   to theme tokens, facilitating the adaptation of component styles based on the current theme.
 *
 * - clearContainerStyle(themeContainer: HTMLElement): This function is essential for resetting an HTML element's styles
 *   to their default state. Within the ThemeProvider, it's used to clear any previously set theme-specific styles,
 *   ensuring a clean slate before applying a new theme or reverting to default styles.
 *
 * - setContainerStyle(themeContainer: HTMLElement, tokens: { [key: string]: string })): This method applies a specified theme to an
 *   HTML element by setting the appropriate CSS variables. It's a crucial part of the ThemeProvider's mechanism for
 *   dynamically applying theme properties, ensuring that components reflect the chosen theme consistently.
 */

import { camelCaseToKebabCase } from '../camelCaseToKebabCase'
import { kebabCaseToCamelCase } from '../kebabCaseToCamelCase'

/**
 * Parses the style of a given HTML element and extracts theme-related properties.
 * This is useful for dynamically reading the current theme values from an element.
 *
 * @param {HTMLElement} themeContainer - The HTML element from which to parse the theme.
 * @returns An object containing the theme properties and their values.
 */
export const parseComputedStyle = (themeContainer: HTMLElement) => {
  const { style } = themeContainer
  const theme: {
    [key: string]: string
  } = {}

  for (let i = 0; i < style.length; i++) {
    const propertyName = style[i]
    if (propertyName.startsWith('--propel')) {
      const cssVarValue = style.getPropertyValue(propertyName).trim()
      theme[kebabCaseToCamelCase(propertyName.replace('--propel-', ''))] = cssVarValue
    }
  }

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
  for (let i = themeContainer.style.length - 1; i >= 0; i--) {
    const property = themeContainer.style.item(i)
    themeContainer.style.removeProperty(property)
  }
}

/**
 * Applies a theme to a given HTML element by setting theme-related CSS variables.
 * It iterates over a predefined list of theme tokens and assigns their corresponding values from the provided theme object.
 * This function is used to dynamically apply a theme to an element.
 *
 * @param {HTMLElement} themeContainer - The HTML element to which the theme is to be applied.
 * @param theme - An object containing the theme properties and their values to be applied.
 */
export const setContainerStyle = (themeContainer: HTMLElement, tokens: { [key: string]: string }) => {
  Object.keys(tokens).forEach((key) => {
    themeContainer.style.setProperty(`--propel-${camelCaseToKebabCase(key)}`, tokens[key])
  })
}
