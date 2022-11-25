/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { request } from 'graphql-request'
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

@customElement('wc-time-series')
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
   * Chartjs default plugins
   */
  private _plugins = [customCanvasBackgroundColor]

  /**
   * Required attribute when smart variant is identified
   */
  private _requiredSmartAttributes = ['metric', 'accessToken']

  /**
   * Required attribute when smart variant is identified
   */
  private _requiredDumbAttributes = ['labels', 'values']

  /**
   * Metric unique name
   */
  @property()
  metric = ''

  /**
   * Relative time range that the chart
   * will respond to
   */
  @property()
  relativeTimeRange = 'LAST_30_DAYS'

  /**
   * Granularity that the chart
   * will respond to
   */
  @property()
  granularity = 'DAY'

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
  accessToken = ''

  /**
   * Basic styles initial state
   */
  @property({ type: Object })
  styles: Styles = stylesInitialState

  protected override async firstUpdated(): Promise<void> {
    if (this._checkAttributesError()) return

    /**
     * It gets the node where the chart will be rendered
     */
    this._root = this.renderRoot.querySelector('#chart-root') as HTMLCanvasElement

    /**
     * If the user passes `values` and `labels` attributes, it
     * should behave as a dumb component without any graphql operation performed
     */
    if (!this._isDumb()) {
      await this.fetchData()
    }

    await this._setupChart()
  }

  override render() {
    return html`
      <div class="chart-container">
        <canvas id="chart-root"> </canvas>
      </div>
    `
  }

  private _checkAttributesError() {
    if (!this.attributes.length) {
      console.error(
        `You should provide at least the following attributes: ${this._requiredDumbAttributes.join(
          ', '
        )} or ${this._requiredSmartAttributes.join(', ')}`
      )
      return true
    }

    if (this._isDumb() && !this._hasRequiredDumbAttributes()) {
      console.error(`You should provide at least the following attributes: ${this._requiredDumbAttributes.join(', ')}`)

      return true
    }

    if (!this._isDumb() && !this._hasRequiredSmartAttributes()) {
      console.error(`You should provide at least the following attributes: ${this._requiredSmartAttributes.join(', ')}`)

      return true
    }

    return false
  }

  private _hasRequiredSmartAttributes() {
    return this._requiredSmartAttributes.every((smartAttr) => !!this.attributes.getNamedItem(smartAttr))
  }

  private _hasRequiredDumbAttributes() {
    return this._requiredDumbAttributes.every((dumbAttr) => !!this.attributes.getNamedItem(dumbAttr))
  }

  private _isDumb() {
    const hasValues = !!this.values && this.values.length > 0
    const hasLabels = !!this.labels && this.labels.length > 0
    return hasValues || hasLabels
  }

  private _setupChartDefaults() {
    Chart.defaults.color = this.styles.font?.color as string
    Chart.defaults.font.size = this.styles.font?.size
    Chart.defaults.font.family = this.styles.font?.family
    Chart.defaults.font.weight = this.styles.font?.weight
    Chart.defaults.font.style = this.styles.font?.style
    Chart.defaults.font.lineHeight = this.styles.font?.lineHeight
  }

  private _buildChartConfig() {
    const data = {
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
    }

    const options = {
      maintainAspectRatio: false,
      plugins: {
        customCanvasBackgroundColor: {
          color: this.styles.canvas?.backgroundColor
        }
      } as any,
      layout: {
        padding: this.styles.canvas?.padding
      },
      scales: {
        x: {
          grid: { drawOnChartArea: false },
          beginAtZero: true,
          ticks: {
            callback: (_: any, index: number) => {
              const labelDate = new Date(this.labels[index])
              const month = labelDate.getUTCMonth() + 1
              const day = labelDate.getUTCDate()

              return `${month}/${day}`
            }
          }
        }
      }
    }

    return {
      type: 'bar',
      responsive: true,
      data,
      options,
      plugins: this._plugins
    } as any
  }

  private async _setupChart() {
    // If a root element is not found, Chart.js won't be able to render anything
    if (!this._root) return

    this._setupChartDefaults()

    const config = this._buildChartConfig()

    new Chart(this._root, config)

    this._root.style.borderRadius = this.styles.canvas?.borderRadius as string
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
  // eslint-disable-next-line
  namespace JSX {
    interface IntrinsicElements {
      'wc-time-series': any
    }
  }
  interface HTMLElementTagNameMap {
    'wc-time-series': TimeSeries
  }
}
