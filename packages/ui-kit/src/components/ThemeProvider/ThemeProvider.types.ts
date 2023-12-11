import type { ChartConfiguration } from 'chart.js'
import React from 'react'
import type { ThemeTokenProps } from '../../themes/theme.types'

export type ThemeContextProps = {
  theme?: ThemeTokenProps

  /**
   * Allows global customization of Chart.js settings for all chart components.
   * The function provided to `ThemeProvider` takes a Chart.js config object
   * (https://www.chartjs.org/docs/latest/configuration/) and returns it with
   * applied customizations, ensuring consistent chart behavior and styling
   * throughout your application.
   */
  globalChartConfigProps?: (config: ChartConfiguration<ChartVariant>) => ChartConfiguration<ChartVariant>
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

export type ChartVariant = 'bar' | 'line'

export interface UseSetupThemeProps extends Pick<ThemeProviderProps, 'baseTheme'> {
  /** The component root element to which the theme will be applied. */
  componentContainer?: HTMLElement | null
}
