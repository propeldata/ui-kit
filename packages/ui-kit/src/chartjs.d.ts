import { ChartType } from 'chart.js'

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    customCanvasBackgroundColor?: {
      color?: string
    }
  }
}
