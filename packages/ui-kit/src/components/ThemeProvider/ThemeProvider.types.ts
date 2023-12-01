import { Chart } from 'chart.js'
import React from 'react'
import type { ThemeTokenProps } from '../../themes/theme.types'

export type ThemeContextProps = {
  theme?: ThemeTokenProps

  /**
   * Configuration function for global `Chart.js` settings.
   * It allows defining or overriding chart configurations globally.
   */
  globalChartConfigProps?: (chart: typeof Chart) => typeof Chart
}

export type DefaultThemes = 'lightTheme' | 'darkTheme'

export interface ThemeProviderProps extends Pick<ThemeContextProps, 'globalChartConfigProps'> {
  /** Children components that the theme will be applied to. */
  children?: React.ReactNode

  /**
   * The initial theme used as a base. It provides a default set of styling
   * from which customizations can be applied.
   */
  baseTheme?: DefaultThemes

  /**
   * This property specifies the theme to be applied to the UI components. The `theme` prop can be used in two ways:
   * 1. As a CSS class name.
   * 2. As a JavaScript object, which should follow the structure of `ThemeTokenProps`. This approach is ideal for detailed, in-line customizations and can be particularly useful when integrating design tokens from CSS-in-JS libraries, such as Material UI.
   *
   * The use of this prop is optional. In its absence, UI Kit components will default to a standard pre-set theme.
   */
  theme?: string | ThemeTokenProps
}

export type ThemeStateProps = ThemeTokenProps | undefined

export interface UseThemeProps extends Pick<ThemeProviderProps, 'baseTheme'> {
  /** The component root element to which the theme will be applied. */
  componentContainer?: HTMLElement | null
}
