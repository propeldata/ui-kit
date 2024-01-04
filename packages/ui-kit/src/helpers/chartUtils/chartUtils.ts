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
  ChartConfiguration,
  Title,
  SubTitle,
  Legend
} from 'chart.js'
import type { ThemeTokenProps } from '../../themes'

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
    TimeSeriesScale,
    CategoryScale,
    LinearScale,
    Filler
  )

  isChartJSRegistered = true
}
