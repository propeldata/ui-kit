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
  Filler,
  ChartDataset,
  Plugin,
  ChartConfiguration
} from 'chart.js'
import type { ThemeTokenProps } from '../../themes'
import { ChartVariant } from '../../components'
import { LeaderboardLabels, PieChartLabels } from '../formatLabels'
import { getPixelFontSizeAsNumber } from '../getPixelFontSizeAsNumber'
import { customCanvasBackgroundColor } from '../customCanvasBackgroundColor'

export type ChartJSDefaultStyleProps = {
  theme?: ThemeTokenProps
  chartConfig?: Partial<ChartConfiguration>
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

export type CustomChartLabelsPluginProps = {
  /** Sets the theme state*/
  theme?: ThemeTokenProps
  /** Whether the chart should show a value inside the bar */
  showBarValues?: boolean
  /** Whether the chart should show the total value inside the doughnut */
  showTotalValue?: boolean
  /** Sets the position of the labels */
  labelPosition?: 'axis' | 'inside' | 'top'
}

export const getCustomChartLabelsPlugin: Plugin<ChartVariant> = ({
  theme,
  showBarValues = false,
  labelPosition = 'axis',
  showTotalValue
}: CustomChartLabelsPluginProps) => {
  return {
    id: 'customChartLabelsPlugin',
    afterDatasetDraw: (chart, args) => {
      const {
        ctx,
        data,
        chartArea: { left },
        scales: { y }
      } = chart

      ctx.save()
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.font = `${theme?.tinyFontWeight} ${theme?.tinyFontSize} ${theme?.tinyFontFamily}`
      ctx.fillStyle = '#ffffff'

      const datasetIndex = args.index
      const datasetMeta = chart.getDatasetMeta(datasetIndex)
      const dataset = data.datasets[datasetIndex] as ChartDataset<ChartVariant, number[]>

      if (showBarValues) {
        dataset.data.forEach((value, index) => {
          const barElement = datasetMeta.data[index] as BarElement

          ctx.fillText(value.toString(), barElement.x - ctx.measureText(value.toString()).width - 8, barElement.y + 0.5)
        })
      }

      if (labelPosition === 'top') {
        ctx.fillStyle = theme?.textSecondary ?? ''
      }

      if (['inside', 'top'].includes(labelPosition)) {
        const labels = data.labels as string[][]
        labels?.forEach((label, index) => {
          const barElement = datasetMeta.data[index] as BarElement
          const { height } = barElement.getProps(['height'])
          const xPos = left + (labelPosition === 'inside' ? 8 : 0)
          const yPos = y.getPixelForValue(index) - (labelPosition === 'inside' ? -1 : height + 4)

          ctx.fillText(label.join(', '), xPos, yPos)
        })
      }

      if (datasetMeta.type === 'doughnut' && showTotalValue) {
        const totalValue = datasetMeta.total.toLocaleString()

        ctx.fillStyle = '#667085'
        ctx.fillText('Total', chart.width / 2 - ctx.measureText('Total').width / 2, chart.height / 2 - 5)

        ctx.font = `${theme?.fontSize} ${theme?.tinyFontFamily}`
        ctx.fillStyle = '#0C111D'
        ctx.fillText(totalValue, chart.width / 2 - ctx.measureText(totalValue).width / 2, chart.height / 2 + 20)
      }
    }
  }
}

export type chartConfigProps<T> = {
  /** Sets the chart configuration*/
  chartConfig: ChartConfiguration<T>
  /** Sets the chart type */
  variant: ChartVariant
  /** Labels of the chart */
  labels: PieChartLabels | LeaderboardLabels
  /** Values of the chart */
  values: (number | null)[]
  /** Sets the background color of the each chart data
   * string for bar and line charts
   * string[] for pie and doughnut charts
   */
  backgroundColor: string | string[] | null
  /** Sets the custom plugin*/
  customPlugins?: object
  /** Sets the custom chart labels plugin*/
  customChartLabelsPlugin: Plugin<ChartVariant>
} & Pick<CustomChartLabelsPluginProps, 'theme' | 'labelPosition'>

export const getChartConfig: ChartConfiguration<ChartVariant> = ({
  chartConfig,
  variant = 'bar',
  labels,
  values,
  backgroundColor,
  theme,
  labelPosition,
  customPlugins,
  customChartLabelsPlugin
}: chartConfigProps<ChartVariant>) => {
  const isPie = variant === 'pie'
  const isDoughnut = variant === 'doughnut'
  const isPieOrDoughnut = isPie || isDoughnut
  const offset = isPieOrDoughnut ? 4 : undefined

  return {
    ...chartConfig,
    type: variant,
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColor,
          barThickness: labelPosition === 'top' ? 8 : 17,
          borderRadius: parseInt(theme?.borderRadiusXs as string) ?? 4,
          borderWidth: 0,
          cutout: isDoughnut ? '75%' : 0,
          offset,
          hoverOffset: isPieOrDoughnut ? 20 : 0
        }
      ]
    },
    options: {
      ...chartConfig.options,
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 4
      },
      plugins: {
        ...chartConfig.options?.plugins,
        ...customPlugins
      },
      scales: {
        x: {
          display: isPieOrDoughnut ? false : true,
          grid: {
            drawOnChartArea: false,
            color: theme?.colorSecondary
          },
          border: {
            color: theme?.colorSecondary
          },
          ticks: {
            font: {
              size: getPixelFontSizeAsNumber(theme?.tinyFontSize)
            }
          },
          beginAtZero: true
        },
        y: {
          display: isPieOrDoughnut ? false : labelPosition === 'axis',
          grid: {
            drawOnChartArea: true,
            drawTicks: false,
            color: theme?.colorSecondary
          },
          border: {
            display: false
          },
          ticks: {
            padding: 17,
            font: {
              size: getPixelFontSizeAsNumber(theme?.tinyFontSize)
            }
          }
        }
      }
    },
    plugins: [customCanvasBackgroundColor, customChartLabelsPlugin]
  }
}
