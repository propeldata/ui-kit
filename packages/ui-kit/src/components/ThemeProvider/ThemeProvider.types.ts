import type { ChartConfiguration } from 'chart.js'
import React from 'react'
import type { ThemeSettingProps, ThemeTokenProps } from '../../themes/theme.types'
import { FallbackComponents } from '../shared.types'

export interface ThemeContextProps extends FallbackComponents {
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

export interface ThemeProps
  extends React.ComponentPropsWithoutRef<'div'>,
    ThemeSettingProps,
    Omit<ThemeContextProps, 'theme'> {
  /** Children components that the theme will be applied to. */
  children?: React.ReactNode
}

export type ThemeStateProps = ThemeTokenProps | undefined

export type ChartVariant = 'bar' | 'line' | 'pie' | 'doughnut'

export interface UseSetupThemeProps
  extends Pick<ThemeProps, 'appearance' | 'accentColor' | 'grayColor' | 'radius' | 'scaling' | 'panelBackground'>,
    FallbackComponents {
  /** The component root element to which the theme will be applied. */
  componentContainer?: HTMLElement | null

  /** The component root element to which the theme will be applied. */
  themeProviderContainer?: HTMLElement | null
}

export interface UseSetupThemeResult<T extends ChartVariant> extends FallbackComponents {
  theme: ThemeStateProps
  chartConfig?: ChartConfiguration<T>
}
