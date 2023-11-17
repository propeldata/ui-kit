import { Chart } from 'chart.js'
import React from 'react'
import type { ThemeTokenProps } from '../../themes/theme.types'

export type ThemeContextProps = {
  theme?: ThemeTokenProps
  globalChartConfigProps?: (chart: typeof Chart) => typeof Chart
}

export type DefaultThemes = 'lightTheme' | 'darkTheme'

export type ThemeProviderProps = {
  children?: React.ReactNode
  baseTheme?: DefaultThemes
  theme?: string | ThemeTokenProps
  globalChartConfigProps?: (chart: typeof Chart) => typeof Chart
}

export type ThemeStateProps = ThemeTokenProps | undefined

export type UseThemeProps = {
  componentContainer?: HTMLElement
  baseTheme?: DefaultThemes
}
