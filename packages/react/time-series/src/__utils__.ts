import React from 'react'
import {
  Chart,
  ChartTypeRegistry,
  TextAlign,
  Scriptable,
  ScriptableTooltipContext,
  ChartConfiguration,
  PluginOptionsByType
} from 'chart.js'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'

import { BarStyles, TimeSeriesData, LineStyles } from './__types__'
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

interface GenereateLineConfigOptions {
  styles: Styles
  lineStyles?: LineStyles
  data: TimeSeriesData
}

function generateCommonOptions(styles: Styles) {
  const hideGridLines = styles.canvas?.hideGridLines || false

  const customPlugins = {
    customCanvasBackgroundColor: {
      color: styles.canvas?.backgroundColor
    }
  } as _DeepPartialObject<PluginOptionsByType<keyof ChartTypeRegistry>>

  console.log(styles.canvas?.width, styles.canvas?.height)

  return {
    responsive: !styles.canvas?.width && !styles.canvas?.height,
    maintainAspectRatio: false,
    layout: {
      padding: styles.canvas?.padding
    },
    plugins: customPlugins,
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
  }
}

export function generateLineConfig(options: GenereateLineConfigOptions): ChartConfiguration {
  const { styles, lineStyles, data } = options
  const { labels, values } = data

  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: values || [],
          borderColor: lineStyles?.line?.borderColor
        }
      ]
    },
    options: generateCommonOptions(styles),
    plugins: [customCanvasBackgroundColor]
  }
}

interface GenereateBarConfigOptions {
  styles: Styles
  barStyles?: BarStyles
  data: TimeSeriesData
}

export function generateBarConfig(options: GenereateBarConfigOptions): ChartConfiguration {
  const { styles, barStyles, data } = options
  const { labels, values } = data

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
    options: generateCommonOptions(styles),
    plugins: [customCanvasBackgroundColor]
  }
}

export function useSetupDefaultStyles(styles: Styles, barStyles?: BarStyles, lineStyles?: LineStyles) {
  React.useEffect(() => {
    async function setupDefaultStyles() {
      Chart.defaults.elements.point.pointStyle = lineStyles?.point?.style || 'circle'
      Chart.defaults.elements.point.radius = lineStyles?.point?.radius || 3
      Chart.defaults.elements.point.backgroundColor = lineStyles?.point?.backgroundColor || '#fff'
      Chart.defaults.elements.point.borderColor = lineStyles?.point?.borderColor || '#000'
      Chart.defaults.elements.point.borderWidth = lineStyles?.point?.borderWidth || 1
      Chart.defaults.elements.point.hoverBorderColor = lineStyles?.point?.hoverBorderColor || 'rgba(0,0,0,0)'
      Chart.defaults.elements.point.hoverBackgroundColor = lineStyles?.point?.hoverBackgroundColor || 'rgba(0,0,0,0)'

      Chart.defaults.elements.bar.borderWidth = barStyles?.bar?.borderWidth || 1
      Chart.defaults.elements.bar.borderRadius = barStyles?.bar?.borderRadius || 6
      Chart.defaults.elements.bar.borderColor = barStyles?.bar?.borderColor || '#000'
      Chart.defaults.elements.bar.hoverBackgroundColor = barStyles?.bar?.hoverBackgroundColor || '#000'
      Chart.defaults.elements.bar.hoverBorderColor = barStyles?.bar?.hoverBorderColor || '#000'

      Chart.defaults.elements.line.tension = lineStyles?.line?.tension || 0.4
      Chart.defaults.elements.line.borderWidth = lineStyles?.line?.borderWidth || 2
      Chart.defaults.elements.line.stepped = lineStyles?.line?.stepped || false

      Chart.defaults.plugins.tooltip.enabled = styles.tooltip?.display || true
      Chart.defaults.plugins.tooltip.padding = styles.tooltip?.padding || 6
      Chart.defaults.plugins.tooltip.backgroundColor = styles.tooltip?.backgroundColor || '#000'
      Chart.defaults.plugins.tooltip.bodyColor = styles.tooltip?.color || '#fff'
      Chart.defaults.plugins.tooltip.titleColor = styles.tooltip?.color || '#fff'
      Chart.defaults.plugins.tooltip.borderColor = styles.tooltip?.borderColor || '#000'
      Chart.defaults.plugins.tooltip.borderWidth = styles.tooltip?.borderWidth || 0
      Chart.defaults.plugins.tooltip.caretSize = styles.tooltip?.caretSize || 5
      Chart.defaults.plugins.tooltip.cornerRadius = styles.tooltip?.borderRadius || 6
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
      Chart.defaults.plugins.tooltip.titleAlign = styles.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
      Chart.defaults.plugins.tooltip.bodyAlign = styles.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
    }

    setupDefaultStyles()
  }, [styles, barStyles, lineStyles])
}
