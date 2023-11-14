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
  Tooltip
} from 'chart.js'
import React from 'react'
import type { ThemeProps } from '../themes'

export type ChartJSDefaultStyleProps = {
  theme: ThemeProps
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
    LinearScale
  )

  isChartJSRegistered = true
}

export const setupChartStyles = ({ theme, globalChartConfigProps }: ChartJSDefaultStyleProps): typeof Chart => {
  if (!theme) {
    return
  }

  if (!isChartJSRegistered) {
    initChartJs()
  }

  // Global
  Chart.defaults.color = theme.textSecondary
  Chart.defaults.backgroundColor = theme.accent
  Chart.defaults.borderColor = theme.borderPrimary

  // Point
  Chart.defaults.elements.point.pointStyle = 'circle'
  Chart.defaults.elements.point.hitRadius = 6
  Chart.defaults.elements.point.radius = 0
  Chart.defaults.elements.point.borderWidth = 2
  Chart.defaults.elements.point.hoverRadius = 6
  Chart.defaults.elements.point.hoverBorderColor = theme.bgPrimary
  Chart.defaults.elements.point.backgroundColor = theme.accentHover
  Chart.defaults.elements.point.hoverBackgroundColor = theme.accentHover

  // Bar
  Chart.defaults.elements.bar.borderWidth = 0
  Chart.defaults.elements.bar.hoverBackgroundColor = theme.accentHover
  // Chart.defaults.elements.bar.backgroundColor = theme.accent

  // Line
  Chart.defaults.elements.line.borderWidth = 3

  // Tooltip
  Chart.defaults.plugins.tooltip.padding = parseInt(theme.spaceXs)
  Chart.defaults.plugins.tooltip.backgroundColor = theme.bgPrimary
  Chart.defaults.plugins.tooltip.bodyColor = theme.textSecondary
  Chart.defaults.plugins.tooltip.titleColor = theme.textSecondary
  Chart.defaults.plugins.tooltip.borderColor = theme.borderPrimary
  Chart.defaults.plugins.tooltip.borderWidth = 1
  Chart.defaults.plugins.tooltip.cornerRadius = 4

  const commonFontSettings = {
    family: theme.fontFamily,
    color: theme.textSecondary
  }

  Chart.defaults.plugins.tooltip.titleFont = {
    ...commonFontSettings,
    size: parseInt(theme.fontSize) * parseFloat(theme.tinyFontSize),
    weight: 'bold',
    lineHeight: theme.tinyFontSize
  }

  if (globalChartConfigProps) {
    globalChartConfigProps(Chart)
  }

  return Chart
}

export function useSetupComponentDefaultChartStyles({ theme, globalChartConfigProps }: ChartJSDefaultStyleProps) {
  React.useEffect(() => {
    if (theme) {
      return
    }

    initChartJs()
    setupChartStyles({ theme, globalChartConfigProps })
  }, [theme, globalChartConfigProps])
}
