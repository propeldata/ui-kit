import { css, Global, ThemeProvider } from '@emotion/react'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import type { Preview, ReactRenderer } from '@storybook/react'
import React from 'react'
import withAxiosDecorator from 'storybook-axios'
import axiosInstance from '../src/axios'

const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      a p {
        display: inline;
        /* @TODO: find a way to customize it without !important dominance */
        color: #2e90fa !important;
      }
    `}
  />
)

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Getting started',
          ['Overview', 'Installation', 'Usage', 'Customization', 'Migration guide'],
          'Components',
          'React'
        ],
        method: 'alphabetical'
      }
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  decorators: [
    // @ts-ignore
    withAxiosDecorator(axiosInstance),
    withThemeFromJSXProvider<ReactRenderer>({
      themes: {
        light: {
          textColor: '#ff0000'
        },
        dark: {
          textColor: '#0000ff'
        }
      },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles: GlobalStyles
    })
  ]
}

export default preview
