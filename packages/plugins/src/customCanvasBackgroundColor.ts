import { Chart } from 'chart.js'

export const customCanvasBackgroundColor: any = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: Chart, _args: { cancelable: true }, options: { color: string }) => {
    const { ctx } = chart
    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = options.color || '#FFFFFF'
    ctx.fillRect(0, 0, chart.width, chart.height)
    ctx.restore()
  }
}
