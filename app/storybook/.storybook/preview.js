import { css } from '@emotion/css'
import './global.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export const decorators = [
  (Story) => (
    <div
      className={css`
        font-family: 'Inter';
        font-size: 12px;
      `}
    >
      <Story />
    </div>
  )
]
