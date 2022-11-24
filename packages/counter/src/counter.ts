import { LitElement, html, adoptStyles, css, unsafeCSS } from 'lit'
import { request } from 'graphql-request'
import { customElement, property } from 'lit/decorators.js'

import { CounterStyles, Position } from './types'
import { QUERY, DEFAULT_PROPEL_API, getTextAlignByPosition, getValueWithPrefixAndSufix } from './utils'
import { stylesInitialState } from './styles'

@customElement('wc-counter')
export class Counter extends LitElement {
  /**
   * If passed, the component
   * will ignore the built-in graphql operations
   */
  @property()
  value = ''

  /**
   * Metric unique name
   * will be ignored when value is passed
   */
  @property()
  metric = ''

  /**
   * Relative time range that the chart
   * will respond to
   * will be ignored when value is passed
   */
  @property()
  relativeTimeRange = 'LAST_30_DAYS'

  /**
   * This should eventually be replaced
   * to customer's app credentials
   * will be ignored when value is passed
   */
  @property()
  accessToken = ''

  /**
   * Symbol to be shown before the value text
   */
  @property()
  prefixValue = ''

  /**
   * Symbol to be shown after the value text
   */
  @property()
  sufixValue = ''

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
      position = stylesInitialState.position,
      background = stylesInitialState.background
    } = this.styles || {}

    if (this.shadowRoot) {
      adoptStyles(this.shadowRoot, [
        css`
          .counter-container {
            width: ${unsafeCSS(width.trim())};
            height: ${unsafeCSS(height.trim())};

            background: ${unsafeCSS(background)};

            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-areas: ${unsafeCSS(
              `"${Position.TopLeft} ${Position.TopCenter} ${Position.TopRight}"
              "${Position.CenterLeft} ${Position.Center} ${Position.CenterRight}"
              "${Position.BottomLeft} ${Position.BottomCenter} ${Position.BottomRight}"`
            )};
          }

          .counter-value {
            grid-area: ${unsafeCSS(position)};

            text-align: ${unsafeCSS(getTextAlignByPosition(position))};
            color: ${unsafeCSS(color.trim())};
            font-size: ${unsafeCSS(fontSize?.trim() || '48px')};
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
    if (!this.value) return null

    return html`
      <div class="counter-container">
        <div class="counter-value">
          ${getValueWithPrefixAndSufix({ prefix: this.prefixValue, value: this.value, sufix: this.sufixValue })}
        </div>
      </div>
    `
  }
}

declare global {
  // eslint-disable-next-line
  namespace JSX {
    interface IntrinsicElements {
      'wc-counter': any
    }
  }
  interface HTMLElementTagNameMap {
    'wc-counter': Counter
  }
}
