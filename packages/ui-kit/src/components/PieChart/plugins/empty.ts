import { Chart } from 'chart.js'

export const emptyStatePlugin = {
  id: 'emptyDoughnut',
  afterDraw(
    chart: Chart,
    args: Record<string, string>,
    options: { width: number; radiusDecrease: number; color: string }
  ) {
    const datasets = chart.data?.datasets ?? []
    const { color, width, radiusDecrease } = options
    let hasData = (datasets?.length ?? 0) > 0

    datasets.forEach((dataset) => {
      if ((dataset.data.length ?? 0) === 0) {
        hasData = false
        return
      }
    })

    if (!hasData) {
      const {
        chartArea: { left, top, right, bottom },
        ctx
      } = chart
      const centerX = (left + right) / 2
      const centerY = (top + bottom) / 2
      const r = Math.min(right - left, bottom - top) / 2

      ctx.beginPath()
      ctx.lineWidth = width || 2
      ctx.strokeStyle = color
      ctx.arc(centerX, centerY, r - radiusDecrease || 0, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }
}
