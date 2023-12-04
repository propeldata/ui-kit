import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  Colors,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  TimeSeriesScale,
  Tooltip,
  Filler
} from 'chart.js'
import React from 'react'
import type { ThemeTokenProps } from '../../themes'
import { getPixelFontSizeAsNumber } from '../getPixelFontSizeAsNumber'

export type ChartJSDefaultStyleProps = {
  theme?: ThemeTokenProps
  globalChartConfigProps?: (chart: typeof Chart) => void
}

let isChartJSRegistered = false

export const initChartJs = () => {
  if (isChartJSRegistered) {
    return
  }

  /**
   * It registers only the modules that will be used
   * in the context of a BarChart and LineChart so
   * we reduce bundle weight
   */

  Chart.register(
    LogarithmicScale,
    Tooltip,
    Colors,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    TimeSeriesScale,
    CategoryScale,
    LinearScale,
    Filler
  )

  isChartJSRegistered = true
}

/**
 * Applies a theme-based style configuration to Chart.js defaults and document properties.
 * It also supports a callback for additional global Chart.js configuration.
 * This function is intended to be called once to initialize or update the chart's styles globally.
 *
 * @param {ChartJSDefaultStyleProps} { theme, globalChartConfigProps } - An object containing the theme properties and an optional callback for additional global configuration.
 * @returns {typeof Chart | undefined} The Chart object if the theme is provided, otherwise undefined.
 */
export const setupChartStyles = ({
  theme,
  globalChartConfigProps
}: ChartJSDefaultStyleProps): typeof Chart | undefined => {
  if (!theme) {
    return
  }

  if (!isChartJSRegistered) {
    initChartJs()
  }

  document.body.style.setProperty('--propel-bg-secondary', theme.bgSecondary ?? null)

  // Global
  Chart.defaults.color = theme.textSecondary ?? ''
  Chart.defaults.backgroundColor = theme.accent ?? ''
  Chart.defaults.borderColor = theme.borderPrimary ?? ''

  // Point
  Chart.defaults.elements.point.pointStyle = 'circle'
  Chart.defaults.elements.point.hitRadius = 6
  Chart.defaults.elements.point.radius = 0
  Chart.defaults.elements.point.borderWidth = 2
  Chart.defaults.elements.point.hoverRadius = 6
  Chart.defaults.elements.point.hoverBorderColor = theme.bgPrimary ?? ''
  Chart.defaults.elements.point.backgroundColor = theme.accentHover ?? ''
  Chart.defaults.elements.point.hoverBackgroundColor = theme.accentHover ?? ''

  // Bar
  Chart.defaults.elements.bar.borderWidth = 0
  Chart.defaults.elements.bar.hoverBackgroundColor = theme.accentHover ?? ''

  // Line
  Chart.defaults.elements.line.borderWidth = 3

  // Tooltip
  Chart.defaults.plugins.tooltip.padding = parseInt(theme.spaceXs as string)
  Chart.defaults.plugins.tooltip.backgroundColor = theme.bgPrimary ?? ''
  Chart.defaults.plugins.tooltip.bodyColor = theme.textSecondary ?? ''
  Chart.defaults.plugins.tooltip.titleColor = theme.textSecondary ?? ''
  Chart.defaults.plugins.tooltip.borderColor = theme.borderPrimary ?? ''
  Chart.defaults.plugins.tooltip.borderWidth = 1
  Chart.defaults.plugins.tooltip.cornerRadius = 4

  const commonFontSettings = {
    family: theme.fontFamily,
    color: theme.textSecondary
  }

  Chart.defaults.plugins.tooltip.titleFont = {
    ...commonFontSettings,
    size: getPixelFontSizeAsNumber(theme.tinyFontSize),
    weight: 'bold',
    lineHeight: theme.tinyLineHeight
  }

  // Pass the Chart object to the callback for additional global configuration.
  if (globalChartConfigProps) {
    globalChartConfigProps(Chart)
  }

  return Chart
}

/**
 * A React hook that initializes default styles for Chart.js components based on the given theme.
 * It calls `setupChartStyles` to apply the theme to Chart.js defaults and sets up any global chart configurations.
 * The hook should be used in a component that renders charts to ensure the styles are applied when the component mounts.
 * The effect will re-run if the `theme` or `globalChartConfigProps` change.
 *
 * @param {ChartJSDefaultStyleProps} { theme, globalChartConfigProps } - An object containing the theme properties and an optional callback for additional global configuration.
 */
export function useSetupComponentDefaultChartStyles({ theme, globalChartConfigProps }: ChartJSDefaultStyleProps) {
  React.useEffect(() => {
    if (theme) {
      return
    }

    initChartJs()
    setupChartStyles({ theme, globalChartConfigProps })
  }, [theme, globalChartConfigProps])
}
