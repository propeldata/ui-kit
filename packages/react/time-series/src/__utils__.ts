import React from 'react'
import {
  Chart,
  ChartTypeRegistry,
  TextAlign,
  Scriptable,
  ScriptableTooltipContext,
  ChartConfiguration,
  ElementOptionsByType,
  PluginOptionsByType
} from 'chart.js'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'

import { BarStyles, TimeSeriesData } from './__types__'
import { Styles } from './TimeSeries'

type _DeepPartialArray<T> = Array<DeepPartial<T>>

// eslint-disable-next-line @typescript-eslint/ban-types
type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined

type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> }

type ElementOptions = ElementOptionsByType<keyof ChartTypeRegistry>

interface GenereateBarConfigOptions {
  styles: Styles
  barStyles?: BarStyles
  data: TimeSeriesData
}

export function generateBarConfig(options: GenereateBarConfigOptions): ChartConfiguration {
  const { styles, barStyles, data } = options
  const { labels, values } = data

  const hideGridLines = styles.canvas?.hideGridLines || false

  const customPlugins = {
    customCanvasBackgroundColor: {
      color: styles.canvas?.backgroundColor
    }
  } as _DeepPartialObject<PluginOptionsByType<keyof ChartTypeRegistry>>

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data: values || [],
          backgroundColor: barStyles?.bar?.backgroundColor,
          borderColor: barStyles?.bar?.borderColor
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: customPlugins,
      layout: {
        padding: styles.canvas?.padding
      },
      scales: {
        x: {
          display: !hideGridLines,
          grid: {
            drawOnChartArea: false
          },
          beginAtZero: true
        },
        y: {
          display: !hideGridLines,
          grid: { drawOnChartArea: true }
        }
      }
    },
    plugins: [customCanvasBackgroundColor]
  }
}

const tooltipStyles = {
  display: true,
  backgroundColor: 'white',
  borderRadius: 6,
  borderColor: 'cornflowerblue',
  borderWidth: 2,
  color: 'cornflowerblue',
  padding: 8,
  alignContent: 'left',
  caretSize: 2
}

export function useSetupDefaultStyles(styles: Styles, barStyles?: BarStyles) {
  React.useEffect(() => {
    async function setupDefaultStyles() {
      const pointOptions: ElementOptions['point'] = {
        radius: 3,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        hitRadius: 1,
        hoverRadius: 4,
        hoverBorderWidth: 1,
        pointStyle: 'circle',
        rotation: 0,
        hoverBorderColor: 'rgba(0,0,0,0)',
        hoverBackgroundColor: 'rgba(0,0,0,0)',
        drawActiveElementsOnTop: true
      }

      Chart.defaults.elements.bar.borderWidth = barStyles?.bar?.borderWidth || 1
      Chart.defaults.elements.bar.borderRadius = barStyles?.bar?.borderRadius || 6
      Chart.defaults.elements.bar.borderColor = barStyles?.bar?.borderColor || '#000'
      Chart.defaults.elements.bar.hoverBackgroundColor = barStyles?.bar?.hoverBackgroundColor || '#000'
      Chart.defaults.elements.bar.hoverBorderColor = barStyles?.bar?.hoverBorderColor || '#000'

      const lineOptions: ElementOptions['line'] = {
        tension: 0.4,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        borderColor: '#000',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        capBezierPoints: true,
        fill: true,
        segment: {
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
          borderColor: '#000',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter'
        },
        stepped: false,
        cubicInterpolationMode: 'default',
        spanGaps: false,
        hoverBackgroundColor: 'rgba(0,0,0,0)',
        hoverBorderCapStyle: 'butt',
        hoverBorderDash: [],
        hoverBorderDashOffset: 0.0,
        hoverBorderJoinStyle: 'miter',
        hoverBorderColor: 'rgba(0,0,0,0)',
        hoverBorderWidth: 2
      }

      Chart.defaults.elements.line = lineOptions
      Chart.defaults.elements.point = pointOptions

      Chart.defaults.plugins.tooltip.enabled = tooltipStyles.display
      Chart.defaults.plugins.tooltip.padding = tooltipStyles.padding
      Chart.defaults.plugins.tooltip.backgroundColor = tooltipStyles.backgroundColor
      Chart.defaults.plugins.tooltip.bodyColor = tooltipStyles.color
      Chart.defaults.plugins.tooltip.titleColor = tooltipStyles.color
      Chart.defaults.plugins.tooltip.borderColor = tooltipStyles.borderColor
      Chart.defaults.plugins.tooltip.borderWidth = tooltipStyles.borderWidth
      Chart.defaults.plugins.tooltip.caretSize = tooltipStyles.caretSize
      Chart.defaults.plugins.tooltip.cornerRadius = tooltipStyles.borderRadius
      Chart.defaults.plugins.tooltip.titleFont = {
        family: styles.font?.family,
        size: styles.font?.size,
        style: styles.font?.style,
        lineHeight: styles.font?.lineHeight
      }
      Chart.defaults.plugins.tooltip.bodyFont = {
        family: styles.font?.family,
        size: styles.font?.size,
        style: styles.font?.style,
        lineHeight: styles.font?.lineHeight
      }
      Chart.defaults.plugins.tooltip.titleAlign = tooltipStyles.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
      Chart.defaults.plugins.tooltip.bodyAlign = tooltipStyles.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
    }

    setupDefaultStyles()
  }, [styles, barStyles])
}
