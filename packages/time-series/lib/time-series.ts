import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { gql, request } from 'graphql-request'
import { customCanvasBackgroundColor } from '@propeldata/wc-plugins'
import {
  BarController,
  LineController,
  BarElement,
  LineElement,
  Colors,
  LinearScale,
  CategoryScale,
  Tooltip,
  Chart
} from 'chart.js'

Chart.register(
  {
    BarController,
    LineController
  },
  {
    BarElement,
    LineElement
  },
  {
    Colors,
    Tooltip
  },
  {
    LinearScale,
    CategoryScale
  }
)

const DEFAULT_PROPEL_API = 'https://api.us-east-2.dev.propeldata.com/graphql'

const QUERY = gql`
  query TimeSeries($uniqueName: String!, $timeSeriesInput: TimeSeriesInput!) {
    metricByName(uniqueName: $uniqueName) {
      timeSeries(input: $timeSeriesInput) {
        labels
        values
      }
    }
  }
`

type PaddingOptions =
  | number
  | {
      top?: number
      bottom?: number
      right?: number
      left?: number
    }

type BarStyles = {
  border?: {
    width?: number
    radius?: number
    color?: string
    hoverColor?: string
  }
  background?: {
    color?: string
    hoverColor?: string
  }
  font?: {
    color?: string
    family?: string
    size?: number
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
  }
  canvas?: {
    width?: string
    height?: string
    backgroundColor?: string
    padding?: PaddingOptions
    borderRadius?: string
  }
}

type Styles = BarStyles

@customElement('time-series')
export class TimeSeries extends LitElement {
  static override styles = css`
    .chart-container {
      border-radius: 10px;
    }
  `

  @state()
  private _root?: HTMLCanvasElement

  @property()
  labels: string[] = []

  @property()
  values: string[] = []

  @property()
  accessToken: string = ''

  @property({ type: Object })
  styles: Styles = {
    border: {
      width: 1,
      radius: 2,
      color: '#94A3B8',
      hoverColor: '#64748B'
    },
    background: {
      color: '#CBD5E1',
      hoverColor: '#64748B'
    },
    canvas: {
      width: '100%',
      backgroundColor: '#ffffff',
      padding: 12,
      borderRadius: '0px'
    },
    font: {
      color: '#475569',
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      weight: '500',
      style: 'normal',
      lineHeight: 1
    }
  }

  override render() {
    return html`
      <div class="chart-container" style="position: relative">
        <canvas id="chart-root"> </canvas>
      </div>
    `
  }

  async setupChart() {
    if (!this._root) return

    Chart.defaults.color = this.styles.font?.color as string
    Chart.defaults.font.size = this.styles.font?.size
    Chart.defaults.font.family = this.styles.font?.family
    Chart.defaults.font.weight = this.styles.font?.weight
    Chart.defaults.font.style = this.styles.font?.style
    Chart.defaults.font.lineHeight = this.styles.font?.lineHeight

    const timeSeriesChart = new Chart(this._root, {
      type: 'bar',
      responsive: true,
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            borderWidth: this.styles.border?.width,
            borderRadius: this.styles.border?.radius,
            borderColor: this.styles.border?.color,
            hoverBorderColor: this.styles.border?.hoverColor,
            backgroundColor: this.styles.background?.color,
            hoverBackgroundColor: this.styles.background?.hoverColor
          }
        ]
      },
      // @ts-ignore
      plugins: [customCanvasBackgroundColor],
      options: {
        plugins: {
          // @ts-ignore
          customCanvasBackgroundColor: {
            color: this.styles.canvas?.backgroundColor
          }
        },
        layout: {
          padding: this.styles.canvas?.padding
        },
        scales: {
          x: {
            grid: {
              drawOnChartArea: false
            },
            beginAtZero: true,
            ticks: {
              callback: (_value, index) => {
                const labelDate = new Date(this.labels[index])
                const month = labelDate.getUTCMonth() + 1
                const day = labelDate.getUTCDate()

                return `${month}/${day}`
              }
            }
          }
        }
      }
    })

    const container = timeSeriesChart.canvas.parentNode as HTMLDivElement

    this._root.style.borderRadius = this.styles.canvas?.borderRadius as string

    container.style.height = this.styles.canvas?.height as string
    container.style.width = this.styles.canvas?.width as string
  }

  async fetchData() {
    const response = await request(
      DEFAULT_PROPEL_API,
      QUERY,
      {
        uniqueName: 'queryCount',
        timeSeriesInput: {
          timeRange: {
            relative: 'LAST_30_DAYS'
          },
          granularity: 'DAY'
        }
      },
      {
        authorization: `Bearer ${this.accessToken}`
      }
    )

    const metricData = response.metricByName.timeSeries

    this.labels = [...metricData.labels]
    this.values = [...metricData.values]
  }

  protected override async firstUpdated(): Promise<void> {
    this._root = this.renderRoot.querySelector('#chart-root') as HTMLCanvasElement
    await this.fetchData()
    await this.setupChart()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-series': TimeSeries
  }
}
