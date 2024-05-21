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
 * - setContainerStyle(themeContainer: HTMLElement, theme: ThemeTokenProps): This method applies a specified theme to an
 *   HTML element by setting the appropriate CSS variables. It's a crucial part of the ThemeProvider's mechanism for
 *   dynamically applying theme properties, ensuring that components reflect the chosen theme consistently.
 */

import type { ThemeTokenProps } from '../../themes/theme.types'
import { themeDict } from '../../themes/themeDict'

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
      Object.assign(theme, { [item.name]: cssVarValue.replace(/"/g, '') })
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
    const themePropValue = theme[item.name as keyof ThemeTokenProps]?.toString()
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}
