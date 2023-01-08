import { ChartConfiguration } from 'chart.js'
import { BarStyles } from './__types__'

export function generateBarConfig(styles: BarStyles): ChartConfiguration {
  const hideGridLines = false
  const responsive = true
  const type = 'bar'

  return {
    type,
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    },
    options: {
      responsive,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
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
    }
  }
}
