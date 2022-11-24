import { LitElement, html, adoptStyles, css, unsafeCSS } from 'lit'
import { request } from 'graphql-request'
import { customElement, property } from 'lit/decorators.js'

import type { CounterStyles } from './types'
import { QUERY, DEFAULT_PROPEL_API } from './utils'
import { stylesInitialState } from './styles'

@customElement('counter-web')
export class Counter extends LitElement {
  /**
   * Scoped css. This won't conflict with elements
   * outside the shadow DOM
   */
  static override styles = []

  /**
   * If passed, the component
   * will ignore the built-in graphql operations
   */
  @property()
  value = ''

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
   * This should eventually be replaced
   * to customer's app credentials
   */
  @property()
  accessToken = ''

  /**
   * Symbol to be shown before the value text
   */
  @property()
  valuePrefix = ''

  /**
   * Symbol to be shown after the value text
   */
  @property()
  valueSufix = ''

  /**
   * If added, it will prevent number's comma separator
   */
  @property()
  noSeparator = false

  /**
   * Basic styles initial state
   */
  @property({ type: Object })
  styles: CounterStyles = stylesInitialState

  protected override async firstUpdated(): Promise<void> {
    this.setupStyles()

    /**
     * If the user passes `value` attribute, it
     * should behave as a dumb component without any graphql operation performed
     */
    if (!this.value) {
      await this.fetchData()
    }
  }

  /**
   * Fetches the counter data
   * when the user doesn't provide
   * its own `value`
   */
  async fetchData() {
    const response = await request(
      DEFAULT_PROPEL_API,
      QUERY,
      {
        uniqueName: this.metric,
        counterInput: {
          timeRange: {
            relative: this.relativeTimeRange
          }
        }
      },
      {
        authorization: `Bearer ${this.accessToken}`
      }
    )

    const metricData = response.metricByName.counter

    this.value = metricData.value
  }

  setupStyles() {
    const {
      width = stylesInitialState.width,
      height = stylesInitialState.height,
      color = stylesInitialState.color,
      fontSize,
      position = stylesInitialState.position
    } = this.styles || {}

    if (this.shadowRoot) {
      adoptStyles(this.shadowRoot, [
        css`
          .counter-container {
            width: ${unsafeCSS(width.trim())};
            height: ${unsafeCSS(height.trim())};
          }

          .counter-value {
            color: ${unsafeCSS(color.trim())};
            font-size: ${unsafeCSS(fontSize?.trim() || '48px')};
            text-align: ${unsafeCSS(position.trim())};
            width: 100%;
            margin: 0;
          }

          @media (min-width: 768px) {
            .counter-value {
              font-size: ${unsafeCSS(fontSize?.trim() || '48px')};
            }
          }

          @media (min-width: 501px) and (max-width: 768px) {
            .counter-value {
              font-size: ${unsafeCSS(fontSize?.trim() || '30px')};
            }
          }

          @media (min-width: 0) and (max-width: 501px) {
            .counter-value {
              font-size: ${unsafeCSS(fontSize?.trim() || '24px')};
            }
          }
        `
      ])
    }
  }

  override render() {
    console.log(this.value)

    if (!this.value) return null

    const value = this.noSeparator ? this.value : parseInt(this.value).toLocaleString()
    const valueWithPrefixAndSufix = (this.valuePrefix || '') + value + (this.valueSufix || '')

    return html`
      <div class="counter-container">
        <p class="counter-value">${valueWithPrefixAndSufix}</p>
      </div>
    `
  }
}

declare global {
  // eslint-disable-next-line
  namespace JSX {
    interface IntrinsicElements {
      'counter-web': any
    }
  }
  interface HTMLElementTagNameMap {
    'counter-web': Counter
  }
}
