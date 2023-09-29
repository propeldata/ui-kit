import { css, Global, ThemeProvider } from '@emotion/react'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import { Source } from '@storybook/blocks'
import type { Preview, ReactRenderer } from '@storybook/react'
import React from 'react'
import withAxiosDecorator from 'storybook-axios'
import axiosInstance from '../src/axios'
import { prettier, getStringAttributes } from '../src/utils'

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
      a.showCodeLink {
        display: block;
        margin-top: 20px;
        cursor: pointer;
        font-size: 0.9em;
        color: #2e90fa;
      }
    `}
  />
)

const withSource = (StoryFn, context) => {
  const [showSource, setShowSource] = React.useState(false)

  let source
  try {
    const docSource = context.parameters.docs.source.originalSource

    // Parse render from the source string
    const lines = docSource.split('\n')
    const renderStr = 'render: args =>'
    const renderStartIndex = lines.findIndex((line) => line.indexOf(renderStr) > -1)
    const renderEndIndex = lines.findIndex(
      (line, index) =>
        index > renderStartIndex && (line === '}' || (line.substr(0, 2) === '  ' && line.charAt(2) !== ' '))
    )
    let render = lines
      .splice(renderStartIndex, renderEndIndex - renderStartIndex)
      .join('\n')
      .replace(renderStr, '')
      .replace('{...args}', getStringAttributes(context.args))
      // Trim the leading and trailing commas
      .replace(/,\s*$/, '')
      .trim('')

    source = prettier(render)
  } catch (e) {
    console.warn(e)
  }

  return (
    <>
      <StoryFn />
      {context.viewMode === 'story' && source && !showSource && (
        <a className="showCodeLink" onClick={() => setShowSource(true)}>
          Show code
        </a>
      )}
      {context.viewMode === 'story' && source && showSource && (
        <Source dark format="dedent" language="tsx" code={source} />
      )}
    </>
  )
}

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Getting started',
          ['Overview', 'Installation', 'Usage', 'Customization', 'Migration guide'],
          'Components',
          ['Counter', 'TimeSeries', 'Leaderboard'],
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
    withSource,
    // @ts-ignore
    withAxiosDecorator(axiosInstance),
    withThemeFromJSXProvider<ReactRenderer>({
      themes: {
        light: {
          textColor: '#ff0000'
        }
        // @TODO: a full themes support will be added later
        // dark: {
        //   textColor: '#0000ff'
        // }
      },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles: GlobalStyles
    })
  ]
}

export default preview
