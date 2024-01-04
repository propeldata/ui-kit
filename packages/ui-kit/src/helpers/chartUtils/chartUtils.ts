import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  Colors,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  ArcElement,
  DoughnutController,
  LogarithmicScale,
  PointElement,
  TimeSeriesScale,
  Tooltip,
  Filler,
  ChartDataset,
  Plugin,
  ChartConfiguration,
  Title,
  SubTitle,
  Legend
} from 'chart.js'
import type { ThemeTokenProps } from '../../themes'
import { ChartVariant } from '../../components'

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
    Title,
    SubTitle,
    Legend,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    PieController,
    ArcElement,
    DoughnutController,
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

export const getCustomChartLabelsPlugin = ({
  theme,
  showBarValues = false,
  labelPosition = 'axis',
  showTotalValue
}: CustomChartLabelsPluginProps): Plugin<ChartVariant> => {
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
      ctx.fillStyle = theme?.textPrimary ?? '#ffffff'

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
        const totalValue = dataset.data.reduce((a: number, c: number) => a + c, 0).toLocaleString()

        ctx.fillStyle = theme?.textSecondary ?? '#667085'
        ctx.fillText('Total', chart.width / 2 - ctx.measureText('Total').width / 2, chart.height / 2 - 5)

        ctx.font = `${theme?.fontSize} ${theme?.tinyFontFamily}`
        ctx.fillStyle = theme?.textPrimary ?? '#0C111D'
        ctx.fillText(totalValue, chart.width / 2 - ctx.measureText(totalValue).width / 2, chart.height / 2 + 20)
      }
    }
  }
}
