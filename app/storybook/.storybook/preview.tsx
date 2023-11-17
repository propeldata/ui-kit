import { Source } from '@storybook/blocks'
import type { Preview } from '@storybook/react'
import React from 'react'
import withAxiosDecorator from 'storybook-axios'
import { ThemeProvider } from '../../../packages/ui-kit/src/components/ThemeProvider'
import axiosInstance from '../src/axios'
import { getStringAttributes, prettier } from '../src/utils'
import './global.css'

const withThemeProvider = (Story, context) => (
  <>
    <ThemeProvider baseTheme={context.globals.theme}>
      <Story />
    </ThemeProvider>
  </>
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

    source = prettier(context.parameters.codeTemplate(render, context))
  } catch (e) {
    console.warn(e)
  }

  return (
    <div style={{ padding: 20 }}>
      <StoryFn />
      {context.viewMode === 'story' && source && !showSource && (
        <a className="showCodeLink" onClick={() => setShowSource(true)}>
          Show code
        </a>
      )}
      {context.viewMode === 'story' && source && showSource && (
        <Source dark format="dedent" language="tsx" code={source} />
      )}
    </div>
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
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'lightTheme',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'lightTheme', icon: 'circlehollow', title: 'light' },
          { value: 'darkTheme', icon: 'circle', title: 'dark' }
        ],
        showName: true
      }
    }
  },
  decorators: [
    withSource,
    // @ts-ignore
    withAxiosDecorator(axiosInstance),
    withThemeProvider
  ]
}

export default preview
