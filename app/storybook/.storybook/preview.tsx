import { Source } from '@storybook/blocks'
import type { Preview, StoryContext } from '@storybook/react'
import React from 'react'
import withAxiosDecorator from 'storybook-axios'
import { ThemeProvider } from '../../../packages/ui-kit/src/components/ThemeProvider'
import axiosInstance from '../src/axios'
import { parseStorySourceCode } from './blocks/SourceCode'
import './global.css'

const withThemeProvider = (Story: React.FC, context: StoryContext) => {
  if (context.parameters.skipThemeProvider) {
    return <Story />
  }

  return (
    <ThemeProvider baseTheme={context.globals.theme}>
      <Story />
    </ThemeProvider>
  )
}

const withSource = (StoryFn: React.FC, context: StoryContext) => {
  const [showSource, setShowSource] = React.useState(false)
  const source = parseStorySourceCode({ context, formatted: true })

  return (
    <div style={{ padding: 20 }}>
      <StoryFn />
      {context.viewMode === 'story' && source && (
        <a className="showCodeLink" onClick={() => setShowSource(!showSource)}>
          {showSource ? 'Hide' : 'Show'} code
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
          ['Overview', 'Installation', 'Usage', 'FAQ', 'Migration guide'],
          'Customization',
          ['Theming', 'Components'],
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
