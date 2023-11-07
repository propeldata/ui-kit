// import { Chart, ChartTypeRegistry, Scriptable, ScriptableTooltipContext, TextAlign } from 'chart.js'
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
  chartProps?: (chart: typeof Chart) => void
}

export const initChartJs = () => {
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
}

// theme: ThemeProps, chartProps?: (chart: typeof Chart) => void
export const setupChartStyles = ({ theme, chartProps }: ChartJSDefaultStyleProps): typeof Chart => {
  // @TODO: find out why it's empty sometimes
  //   if (!Chart.defaults.elements.point) {
  //     console.log('aaa')
  //     return
  //   }
  //   console.log('setupChartStyles', JSON.stringify(Chart.defaults, null, 2))

  // const pointStyle = styles?.point?.style as ScriptableAndArray<
  //   PointStyle,
  //   ScriptableContext<keyof ChartTypeRegistry>
  // >

  const font = {
    family: theme?.fontFamily,
    size: theme?.fontSize,
    // style: theme.,
    // lineHeight: theme.,
    color: theme?.textSecondary
  }
  // const font = {
  //   family: styles?.font?.family,
  //   size: styles?.font?.size as Scriptable<number | undefined, ScriptableTooltipContext<keyof ChartTypeRegistry>>,
  //   style: styles?.font?.style,
  //   lineHeight: styles?.font?.lineHeight,
  //   color: styles?.font?.color || defaultStyles.font.color
  // }

  Chart.defaults.color = theme?.textSecondary
  Chart.defaults.backgroundColor = theme?.accent
  Chart.defaults.borderColor = theme?.borderPrimary

  // Point
  Chart.defaults.elements.point.pointStyle = 'circle'
  Chart.defaults.elements.point.radius = 2
  //   Chart.defaults.elements.point.backgroundColor =
  //     styles?.point?.backgroundColor || defaultStyles.point.backgroundColor
  //   Chart.defaults.elements.point.borderColor = styles?.point?.borderColor || defaultStyles.point.borderColor
  //   Chart.defaults.elements.point.borderWidth = styles?.point?.borderWidth || defaultStyles.point.borderWidth
  //   Chart.defaults.elements.point.hoverBorderColor =
  //     styles?.point?.hoverBorderColor || defaultStyles.point.hoverBorderColor
  //   Chart.defaults.elements.point.hoverBackgroundColor =
  //     styles?.point?.hoverBackgroundColor || defaultStyles.point.hoverBackgroundColor

  // Bar
  // Chart.defaults.elements.bar.backgroundColor = theme?.bgAccent
  Chart.defaults.elements.bar.borderWidth = 0
  // Chart.defaults.elements.bar.hoverBackgroundColor = theme?.bgAccentHover

  // Line
  //   Chart.defaults.elements.line.tension = styles?.line?.tension || defaultStyles.line.tension
  Chart.defaults.elements.line.borderWidth = 1
  //   Chart.defaults.elements.line.stepped = styles?.line?.stepped || defaultStyles.line.stepped
  // Chart.defaults.elements.line.borderColor = '#ff0000'

  // Tooltip
  //   Chart.defaults.plugins.tooltip.enabled =
  //     styles?.tooltip?.display !== undefined ? styles?.tooltip?.display : defaultStyles.tooltip.display
  //   Chart.defaults.plugins.tooltip.padding = styles?.tooltip?.padding || defaultStyles.tooltip.padding
  Chart.defaults.plugins.tooltip.backgroundColor = theme?.bgPrimary
  //   Chart.defaults.plugins.tooltip.bodyColor = styles?.tooltip?.color || defaultStyles.tooltip.color
  //   Chart.defaults.plugins.tooltip.titleColor = styles?.tooltip?.color || defaultStyles.tooltip.color
  //   Chart.defaults.plugins.tooltip.borderColor = styles?.tooltip?.borderColor || defaultStyles.tooltip.borderColor
  //   Chart.defaults.plugins.tooltip.borderWidth = styles?.tooltip?.borderWidth || defaultStyles.tooltip.borderWidth
  //   Chart.defaults.plugins.tooltip.caretSize = styles?.tooltip?.caretSize || defaultStyles.tooltip.caretSize
  //   Chart.defaults.plugins.tooltip.cornerRadius = styles?.tooltip?.borderRadius || defaultStyles.tooltip.borderRadius
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Chart.defaults.plugins.tooltip.titleFont = font
  //   Chart.defaults.plugins.tooltip.titleAlign = styles?.tooltip?.alignContent as Scriptable<
  //     TextAlign,
  //     ScriptableTooltipContext<keyof ChartTypeRegistry>
  //   >
  //   Chart.defaults.plugins.tooltip.bodyAlign = styles?.tooltip?.alignContent as Scriptable<
  //     TextAlign,
  //     ScriptableTooltipContext<keyof ChartTypeRegistry>
  //   >
  if (chartProps) {
    chartProps(Chart)
  }

  return Chart
}

export function useSetupComponentDefaultChartStyles({ theme, chartProps }: ChartJSDefaultStyleProps) {
  React.useEffect(() => {
    if (theme || Boolean(theme?.themeClassName)) {
      return
    }
    console.log('useSetupComponentDefaultChartStyles')
    initChartJs()
    setupChartStyles({ theme, chartProps })
  }, [theme, chartProps])
}
