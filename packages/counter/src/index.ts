/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, adoptStyles, css, unsafeCSS } from 'lit'
import { request } from 'graphql-request'
import { customElement, property } from 'lit/decorators.js'

import { CounterStyles } from './types'
import {
  QUERY,
  DEFAULT_PROPEL_API,
  getTextAlignByPosition,
  getValueWithPrefixAndSufix,
  getJustifyContentByPosition,
  getAlignItemsByPosition
} from './utils'
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
   * Required attribute when smart variant is identified
   */
  private _requiredSmartAttributes = ['metric', 'accessToken']

  /**
   * Required attribute when smart variant is identified
   */
  private _requiredDumbAttributes = ['value']

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
    if (this._checkAttributesError()) return

    this._setupStyles()

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

  _setupStyles() {
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

            display: flex;

            justify-content: ${unsafeCSS(getJustifyContentByPosition(position))};
            align-items: ${unsafeCSS(getAlignItemsByPosition(position))};
          }

          .counter-value {
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

  /**
   * Checks if the implementation has the required attributes
   */
  private _checkAttributesError() {
    const prefixMessage = 'CounterAttributesError: You should provide at least the following attributes:'

    if (!this.attributes.length) {
      console.error(
        `${prefixMessage} ${this._requiredDumbAttributes.join(', ')} or ${this._requiredSmartAttributes.join(', ')}`
      )
      return true
    }

    if (this._isDumb() && !this._hasRequiredDumbAttributes()) {
      console.error(`${prefixMessage} ${this._requiredDumbAttributes.join(', ')}`)

      return true
    }

    if (!this._isDumb() && !this._hasRequiredSmartAttributes()) {
      console.error(`${prefixMessage} ${this._requiredSmartAttributes.join(', ')}`)

      return true
    }

    return false
  }

  /**
   * Checks if the current smart attributes match the required ones
   */
  private _hasRequiredSmartAttributes() {
    return this._requiredSmartAttributes.every((smartAttr) => !!this.attributes.getNamedItem(smartAttr))
  }

  /**
   * Checks if the current dumb attributes match the required ones
   */
  private _hasRequiredDumbAttributes() {
    return this._requiredDumbAttributes.every((dumbAttr) => !!this.attributes.getNamedItem(dumbAttr))
  }

  /**
   * If the user passes `value` attribute, it
   * should behave as a dumb component without any graphql operation performed
   */
  private _isDumb() {
    return !!this.value
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'wc-counter': any
    }
  }
  interface HTMLElementTagNameMap {
    'wc-counter': Counter
  }
}
