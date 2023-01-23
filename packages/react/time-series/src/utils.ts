/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react'
import {
  Chart,
  ChartTypeRegistry,
  TextAlign,
  Scriptable,
  ScriptableTooltipContext,
  ChartConfiguration,
  PointStyle,
  ScriptableAndArray,
  ScriptableContext
} from 'chart.js'

import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'

import { TimeSeriesData, Styles, ChartVariant, CustomPlugins } from './types'
import { defaultStyles } from './defaults'

interface GenereateConfigOptions {
  variant: ChartVariant
  styles?: Styles
  data: TimeSeriesData
}

export function generateConfig(options: GenereateConfigOptions): ChartConfiguration {
  const { styles, data, variant } = options

  const hideGridLines = styles?.canvas?.hideGridLines || false

  const customPlugins = {
    customCanvasBackgroundColor: {
      color: styles?.canvas?.backgroundColor
    }
  } as CustomPlugins

  const backgroundColor = styles?.[variant]?.backgroundColor || defaultStyles[variant]?.backgroundColor!
  const borderColor = styles?.[variant]?.borderColor || defaultStyles?.[variant]?.borderColor!

  return {
    type: variant,
    data: {
      labels: data.labels || [],
      datasets: [
        {
          data: data.values || [],
          backgroundColor,
          borderColor
        }
      ]
    },
    options: {
      responsive: !styles?.canvas?.width,
      maintainAspectRatio: false,
      animation: false,
      layout: {
        padding: styles?.canvas?.padding
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

export function useSetupDefaultStyles(styles?: Styles) {
  React.useEffect(() => {
    async function setupDefaultStyles() {
      const pointStyle = styles?.point?.style as ScriptableAndArray<
        PointStyle,
        ScriptableContext<keyof ChartTypeRegistry>
      >

      const font = {
        family: styles?.font?.family,
        size: styles?.font?.size as Scriptable<number | undefined, ScriptableTooltipContext<keyof ChartTypeRegistry>>,
        style: styles?.font?.style,
        lineHeight: styles?.font?.lineHeight,
        color: styles?.font?.color || defaultStyles.font?.color!
      }

      Chart.defaults.color = styles?.font?.color || defaultStyles.font?.color!

      Chart.defaults.elements.point.pointStyle = pointStyle === undefined ? 'circle' : pointStyle
      Chart.defaults.elements.point.radius = styles?.point?.radius || defaultStyles.point?.radius!
      Chart.defaults.elements.point.backgroundColor =
        styles?.point?.backgroundColor || defaultStyles.point?.backgroundColor!
      Chart.defaults.elements.point.borderColor = styles?.point?.borderColor || styles?.point?.backgroundColor!
      Chart.defaults.elements.point.borderWidth = styles?.point?.borderWidth || defaultStyles.point?.borderWidth!
      Chart.defaults.elements.point.hoverBorderColor = styles?.point?.hoverBorderColor || styles?.point?.borderColor!
      Chart.defaults.elements.point.hoverBackgroundColor =
        styles?.point?.hoverBackgroundColor || styles?.point?.backgroundColor!

      Chart.defaults.elements.bar.borderWidth = styles?.bar?.borderWidth || defaultStyles.bar?.borderWidth!
      Chart.defaults.elements.bar.borderRadius = styles?.bar?.borderRadius || defaultStyles.bar?.borderRadius!
      Chart.defaults.elements.bar.borderColor = styles?.bar?.borderColor || styles?.bar?.backgroundColor!
      Chart.defaults.elements.bar.hoverBackgroundColor =
        styles?.bar?.hoverBackgroundColor || styles?.bar?.backgroundColor!
      Chart.defaults.elements.bar.hoverBorderColor = styles?.bar?.hoverBorderColor || styles?.bar?.borderColor!

      Chart.defaults.elements.line.tension = styles?.line?.tension || defaultStyles.line?.tension!
      Chart.defaults.elements.line.borderWidth = styles?.line?.borderWidth || defaultStyles.line?.borderWidth!
      Chart.defaults.elements.line.stepped = styles?.line?.stepped || defaultStyles.line?.stepped!
      Chart.defaults.elements.line.borderColor = styles?.line?.borderColor || defaultStyles.line?.borderColor!

      Chart.defaults.plugins.tooltip.enabled = styles?.tooltip?.display || defaultStyles.tooltip?.display!
      Chart.defaults.plugins.tooltip.padding = styles?.tooltip?.padding || defaultStyles.tooltip?.padding!
      Chart.defaults.plugins.tooltip.backgroundColor =
        styles?.tooltip?.backgroundColor || defaultStyles.tooltip?.backgroundColor!
      Chart.defaults.plugins.tooltip.bodyColor = styles?.tooltip?.color || defaultStyles.tooltip?.color!
      Chart.defaults.plugins.tooltip.titleColor = styles?.tooltip?.color || defaultStyles.tooltip?.color!
      Chart.defaults.plugins.tooltip.borderColor = styles?.tooltip?.borderColor || defaultStyles.tooltip?.borderColor!
      Chart.defaults.plugins.tooltip.borderWidth = styles?.tooltip?.borderWidth || defaultStyles.tooltip?.borderWidth!
      Chart.defaults.plugins.tooltip.caretSize = styles?.tooltip?.caretSize || defaultStyles.tooltip?.caretSize!
      Chart.defaults.plugins.tooltip.cornerRadius =
        styles?.tooltip?.borderRadius || defaultStyles.tooltip?.borderRadius!
      Chart.defaults.plugins.tooltip.titleFont = font
      Chart.defaults.plugins.tooltip.bodyFont = font
      Chart.defaults.plugins.tooltip.titleAlign = styles?.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
      Chart.defaults.plugins.tooltip.bodyAlign = styles?.tooltip?.alignContent as Scriptable<
        TextAlign,
        ScriptableTooltipContext<keyof ChartTypeRegistry>
      >
    }

    setupDefaultStyles()
  }, [styles])
}
