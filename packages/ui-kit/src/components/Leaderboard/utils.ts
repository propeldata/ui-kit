import {
  Chart
  // ChartTypeRegistry,
  // Scriptable,
  // ScriptableTooltipContext,
  // TextAlign
} from 'chart.js'
// import React from 'react'
import { defaultStyles, ChartPlugins } from '../../themes'

interface GetTableSettingsOptions {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export function getTableSettings(options: GetTableSettingsOptions) {
  const { headers, rows } = options

  const headersWithoutValue = headers?.slice(0, headers.length - 1)
  const valueHeader = headers?.[headers.length - 1]

  const rowsWithoutValue = rows?.map((row) => row.slice(0, row.length - 1))

  const valuesByRow = rows?.map((row) => (row[row.length - 1] === null ? null : row[row.length - 1]))

  const isValidValueBar = valuesByRow.every((value) => !isNaN(parseFloat(value)))

  const numberValuesByRow = isValidValueBar ? valuesByRow.map((value) => (value === null ? null : Number(value))) : null
  const maxValue = isValidValueBar ? Math.max(...(numberValuesByRow || []).map((value) => value ?? -Infinity)) : null

  // const isOrdered = styles?.table?.isOrdered || defaultStyles.table.isOrdered
  const isOrdered = defaultStyles.table.isOrdered

  return { headersWithoutValue, valueHeader, valuesByRow, rowsWithoutValue, maxValue, isOrdered }
}

export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: string | null
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (value == null) return

  return (prefix ? prefix + ' ' : '') + getDisplayValue({ value, localize }) + (sufix ? ' ' + sufix : '')
}

// export function useSetupDefaultStyles(styles?: ChartStyles) {
//   React.useEffect(() => {
//     async function setupDefaultStyles() {
//       const font = {
//         family: styles?.font?.family || defaultStyles.font.family,
//         size: styles?.font?.size || defaultStyles.font.size,
//         style: styles?.font?.style || defaultStyles.font.style,
//         lineHeight: styles?.font?.lineHeight || defaultStyles.font.lineHeight,
//         color: styles?.font?.color || defaultStyles.font.color
//       }

//       Chart.defaults.color = styles?.font?.color || defaultStyles.font.color

//       Chart.defaults.elements.bar.borderWidth = styles?.bar?.borderWidth || defaultStyles.bar.borderWidth
//       Chart.defaults.elements.bar.borderRadius = styles?.bar?.borderRadius || defaultStyles.bar.borderRadius
//       Chart.defaults.elements.bar.borderColor = styles?.bar?.borderColor || defaultStyles.bar.backgroundColor
//       Chart.defaults.elements.bar.hoverBackgroundColor =
//         styles?.bar?.hoverBackgroundColor || defaultStyles.bar.backgroundColor
//       Chart.defaults.elements.bar.hoverBorderColor = styles?.bar?.hoverBorderColor || defaultStyles.bar.borderColor

//       Chart.defaults.plugins.tooltip.enabled =
//         styles?.tooltip?.display !== undefined ? styles?.tooltip?.display : defaultStyles.tooltip.display
//       Chart.defaults.plugins.tooltip.padding = styles?.tooltip?.padding || defaultStyles.tooltip.padding
//       Chart.defaults.plugins.tooltip.backgroundColor =
//         styles?.tooltip?.backgroundColor || defaultStyles.tooltip.backgroundColor
//       Chart.defaults.plugins.tooltip.bodyColor =
//         styles?.tooltip?.color || styles?.bar?.backgroundColor || defaultStyles.tooltip.color
//       Chart.defaults.plugins.tooltip.titleColor =
//         styles?.tooltip?.color || styles?.bar?.backgroundColor || defaultStyles.tooltip.color
//       Chart.defaults.plugins.tooltip.borderColor =
//         styles?.tooltip?.borderColor || styles?.bar?.borderColor || defaultStyles.tooltip.borderColor
//       Chart.defaults.plugins.tooltip.borderWidth = styles?.tooltip?.borderWidth || defaultStyles.tooltip.borderWidth
//       Chart.defaults.plugins.tooltip.caretSize = styles?.tooltip?.caretSize || defaultStyles.tooltip.caretSize
//       Chart.defaults.plugins.tooltip.cornerRadius = styles?.tooltip?.borderRadius || defaultStyles.tooltip.borderRadius
//       Chart.defaults.plugins.tooltip.titleFont = {
//         family: font.family,
//         lineHeight: font.lineHeight
//       }
//       Chart.defaults.plugins.tooltip.titleAlign = styles?.tooltip?.alignContent as Scriptable<
//         TextAlign,
//         ScriptableTooltipContext<keyof ChartTypeRegistry>
//       >
//       Chart.defaults.plugins.tooltip.bodyAlign = styles?.tooltip?.alignContent as Scriptable<
//         TextAlign,
//         ScriptableTooltipContext<keyof ChartTypeRegistry>
//       >
//     }

//     setupDefaultStyles()
//   }, [styles])
// }

interface UpdateChartConfigOptions {
  chart: Chart
  labels: Array<string | null>
  values: Array<number | null>
  customPlugins: ChartPlugins
}

export function updateChartConfig(options: UpdateChartConfigOptions) {
  const { chart, labels, values, customPlugins } = options

  const dataset = chart.data.datasets[0]

  chart.data.labels = labels
  dataset.data = values

  chart.options.plugins = customPlugins
}

interface UpdateChartStylesConfig {
  chart: Chart
}

export function updateChartStyles(options: UpdateChartStylesConfig) {
  const { chart } = options

  const dataset = chart.data.datasets[0]

  // dataset.backgroundColor = styles?.bar?.backgroundColor || defaultStyles.bar.backgroundColor
  // dataset.borderColor = styles?.bar?.borderColor || defaultStyles?.bar.borderColor
  // dataset.borderWidth = styles?.bar?.borderWidth || defaultStyles.bar.borderWidth
  // dataset.hoverBorderColor = styles?.bar?.hoverBorderColor || defaultStyles.bar.hoverBorderColor

  // if (chart.options.layout) {
  //   chart.options.layout.padding = styles?.canvas?.padding || defaultStyles.canvas.padding
  // }

  dataset.backgroundColor = defaultStyles.bar.backgroundColor
  dataset.borderColor = defaultStyles?.bar.borderColor
  dataset.borderWidth = defaultStyles.bar.borderWidth
  dataset.hoverBorderColor = defaultStyles.bar.hoverBorderColor

  if (chart.options.layout) {
    chart.options.layout.padding = defaultStyles.canvas.padding
  }
}
