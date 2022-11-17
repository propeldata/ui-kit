import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { request } from 'graphql-request'
import { customCanvasBackgroundColor } from '@propel-wc/plugins'
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
import { scopedStyles, stylesInitialState } from './styles'
import { BarStyles } from './types'
import { QUERY, DEFAULT_PROPEL_API } from './utils'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
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

/**
 * `styles` attribute can be either `BarStyles` or `LineStyles`
 */
type Styles = BarStyles

@customElement('time-series')
export class TimeSeries extends LitElement {
  /**
   * Scoped css. This won't conflict with elements
   * outside the shadow DOM
   */
  static override styles = scopedStyles

  /**
   * The html node where the chart will render
   */
  @state()
  private _root?: HTMLCanvasElement

  /**
   * Metric unique name
   */
  @property()
  metric: string = ''

  /**
   * Relative time range that the chart
   * will respond to
   */
  @property()
  relativeTimeRange: string = 'LAST_30_DAYS'

  /**
   * Granularity that the chart
   * will respond to
   */
  @property()
  granularity: string = 'DAY'

  /**
   * If passed along with `values`, the component
   * will ignore the built-in graphql operations
   */
  @property({ type: Array })
  labels: string[] = []

  /**
   * If passed along with `labels`, the component
   * will ignore the built-in graphql operations
   */
  @property({ type: Array })
  values: string[] = []

  /**
   * This should eventually be replaced
   * to customer's app credentials
   */
  @property()
  accessToken: string = ''

  /**
   * Basic styles initial state
   */
  @property({ type: Object })
  styles: Styles = stylesInitialState

  protected override async firstUpdated(): Promise<void> {
    /**
     * It gets the node where the chart will be rendered
     */
    this._root = this.renderRoot.querySelector('#chart-root') as HTMLCanvasElement

    /**
     * If the user passes `values` and `labels` attributes, it
     * should behave as a dumb component without any graphql operation performed
     */
    if (!this.values.length || !this.labels.length) {
      await this.fetchData()
    }

    await this.setupChart()
  }

  override render() {
    return html`
      <div class="chart-container" style="position: relative">
        <canvas id="chart-root"> </canvas>
      </div>
    `
  }

  async setupChart() {
    // If a root element is not found, Chart.js won't be able to render anything
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

  /**
   * Fetches the timse series data
   * when the user doesn't provide
   * its on `labels` and `values`
   */
  async fetchData() {
    const response = await request(
      DEFAULT_PROPEL_API,
      QUERY,
      {
        uniqueName: this.metric,
        timeSeriesInput: {
          timeRange: {
            relative: this.relativeTimeRange
          },
          granularity: this.granularity
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
}

declare global {
  interface HTMLElementTagNameMap {
    'time-series': TimeSeries
  }
}
