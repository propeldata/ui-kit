import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  ChartDataset,
  Colors,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  Plugin,
  PointElement,
  SubTitle,
  TimeSeriesScale,
  Title,
  Tooltip
} from 'chart.js'
import { ChartVariant } from '../../components'
import type { ThemeTokenProps } from '../../themes'
import { getPixelFontSizeAsNumber } from './../getPixelFontSizeAsNumber/getPixelFontSizeAsNumber'

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
  /** Sets the position of the labels */
  labelPosition?: 'axis' | 'inside' | 'top'
  /** Hides the total value on chart if it is set the true
   * @default false
   */
  hideTotal?: boolean
}

export const getCustomChartLabelsPlugin = ({
  theme,
  showBarValues = false,
  labelPosition = 'axis',
  hideTotal = false
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

      const fontFamily = theme?.getVar('--propel-default-font-family')

      ctx.save()
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.font = `${theme?.getVar('--propel-font-weight-regular')} ${getPixelFontSizeAsNumber(
        theme?.getVar('--propel-font-size-1')
      )}px ${fontFamily}`
      ctx.fillStyle = theme?.getVar('--propel-gray-11') ?? ''

      const datasetIndex = args.index
      const datasetMeta = chart.getDatasetMeta(datasetIndex)
      const dataset = data.datasets[datasetIndex] as ChartDataset<ChartVariant, number[]>

      if (showBarValues) {
        ctx.fillStyle = theme?.getVar('--propel-gray-2') ?? ''
        dataset.data.forEach((value, index) => {
          const barElement = datasetMeta.data[index]

          ctx.fillText(value.toString(), barElement.x - 8, barElement.y + 0.5)
        })
      }

      if (labelPosition === 'top') {
        ctx.fillStyle = theme?.getVar('--propel-gray-11') ?? ''
      }

      if (labelPosition === 'inside') {
        ctx.fillStyle = theme?.getVar('--propel-gray-2') ?? ''
      }

      if (['inside', 'top'].includes(labelPosition)) {
        const labels = data.labels as string[][]
        labels?.forEach((label, index) => {
          const barElement = datasetMeta.data[index]
          const { height } = barElement.getProps(['height'])
          const xPos = left + ctx.measureText(label.toString()).width + (labelPosition === 'inside' ? 14 : 6)
          const yPos = y.getPixelForValue(index) - (labelPosition === 'inside' ? -1 : height + 4)

          ctx.fillText(label.join(', '), xPos, yPos)
        })
      }

      if (datasetMeta.type === 'doughnut' && !hideTotal) {
        const totalValue = dataset.data.reduce((a: number, c: number) => a + c, 0).toLocaleString()

        ctx.save()

        const xCoor = chart.getDatasetMeta(0).data[0]?.x
        const yCoor = chart.getDatasetMeta(0).data[0]?.y

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.font = `${getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-2'))}px ${fontFamily}`
        ctx.fillText('Total', xCoor, yCoor - 12)

        ctx.font = `${theme?.getVar('--propel-font-weight-bold')} ${getPixelFontSizeAsNumber(
          theme?.getVar('--propel-font-size-6')
        )}px ${fontFamily}`
        ctx.fillText(totalValue, xCoor, yCoor + 12)
      }
    }
  }
}
