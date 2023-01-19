import React from 'react'
import { Chart, ChartTypeRegistry, TextAlign, Scriptable, ScriptableTooltipContext, ChartConfiguration } from 'chart.js'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'

import { TimeSeriesData, Styles, ChartVariant, CustomPlugins } from './types'

interface GenereateConfigOptions {
  variant: ChartVariant
  styles: Styles
  data: TimeSeriesData
}

export function generateConfig(options: GenereateConfigOptions): ChartConfiguration {
  const { styles, data, variant } = options

  const hideGridLines = styles.canvas?.hideGridLines || false

  const customPlugins = {
    customCanvasBackgroundColor: {
      color: styles.canvas?.backgroundColor
    }
  } as CustomPlugins

  return {
    type: variant,
    data: {
      labels: data.labels || [],
      datasets: [
        {
          data: data.values || [],
          backgroundColor: styles?.[variant]?.backgroundColor,
          borderColor: styles?.[variant]?.borderColor
        }
      ]
    },
    options: {
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
    },
    plugins: [customCanvasBackgroundColor]
  }
}

export function useSetupDefaultStyles(styles: Styles) {
  React.useEffect(() => {
    async function setupDefaultStyles() {
      Chart.defaults.elements.point.pointStyle = styles?.point?.style || 'circle'
      Chart.defaults.elements.point.radius = styles?.point?.radius || 3
      Chart.defaults.elements.point.backgroundColor = styles?.point?.backgroundColor || '#fff'
      Chart.defaults.elements.point.borderColor = styles?.point?.borderColor || '#000'
      Chart.defaults.elements.point.borderWidth = styles?.point?.borderWidth || 1
      Chart.defaults.elements.point.hoverBorderColor = styles?.point?.hoverBorderColor || 'rgba(0,0,0,0)'
      Chart.defaults.elements.point.hoverBackgroundColor = styles?.point?.hoverBackgroundColor || 'rgba(0,0,0,0)'

      Chart.defaults.elements.bar.borderWidth = styles?.bar?.borderWidth || 1
      Chart.defaults.elements.bar.borderRadius = styles?.bar?.borderRadius || 6
      Chart.defaults.elements.bar.borderColor = styles?.bar?.borderColor || '#000'
      Chart.defaults.elements.bar.hoverBackgroundColor = styles?.bar?.hoverBackgroundColor || '#000'
      Chart.defaults.elements.bar.hoverBorderColor = styles?.bar?.hoverBorderColor || '#000'

      Chart.defaults.elements.line.tension = styles?.line?.tension || 0.4
      Chart.defaults.elements.line.borderWidth = styles?.line?.borderWidth || 2
      Chart.defaults.elements.line.stepped = styles?.line?.stepped || false

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
  }, [styles])
}
