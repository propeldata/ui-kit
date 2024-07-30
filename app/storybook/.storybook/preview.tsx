import { Source } from '@storybook/blocks'
import type { Preview, StoryContext } from '@storybook/react'
import React from 'react'
import withAxiosDecorator from 'storybook-axios'
import { ThemeProvider, useTheme } from '../../../packages/ui-kit/src/components/ThemeProvider'
import { QueryClient, QueryClientProvider } from '../../../packages/ui-kit/src/graphql'
import { accentColors, grayColors, getMatchingGrayColor, radii, scalings } from '../../../packages/ui-kit/src/themes'
import axiosInstance from '../src/axios'
import { parseStorySourceCode } from './blocks/SourceCode'
import './global.css'

const GlobalStyles = () => {
  const theme = useTheme()
  if (document && theme) {
    document.body.style.setProperty('--bg-color', theme.getVar('--propel-accent-1'))
  }
  return null
}

// const MyCustomButton = ({ children }: React.ComponentPropsWithoutRef<'button'>) => <button>{children}</button>

const withThemeProvider = (Story: React.FC, context: StoryContext) => {
  if (context.parameters.skipThemeProvider) {
    return <Story />
  }

  return (
    <>
      <ThemeProvider
        appearance={context.globals.appearance}
        accentColor={context.globals.accentColor}
        grayColor={context.globals.grayColor}
        radius={context.globals.radius}
        scaling={context.globals.scaling}
        // className="themeProvider"
        // components={{
        //   Button: (props) => <MyCustomButton {...props} />
        // }}
      >
        <GlobalStyles />
        <Story />
      </ThemeProvider>
    </>
  )
}

const withQueryClientProvider = (Story: React.FC, context: StoryContext) => {
  const queryClient = new QueryClient()

  if (context.parameters.skipQueryClientProvider) {
    return <Story />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
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
          ['Overview', 'Installation', 'Authentication', 'Usage', 'Querying Metrics', 'FAQ', 'Migration guide'],
          'Customization',
          ['Theming', 'Components'],
          'Components',
          'API',
          'Hooks'
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
    appearance: {
      name: 'Appearance',
      description: 'Global theme appearance',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light appearance' },
          { value: 'dark', title: 'Dark appearance' }
        ],
        showName: true
      }
    },
    accentColor: {
      name: 'Accent color',
      description: 'Global theme accent color',
      defaultValue: 'blue',
      toolbar: {
        icon: 'circle',
        items: accentColors.map((color) => ({ value: color, title: color })),
        showName: true
      }
    },
    grayColor: {
      name: 'Gray color',
      description: 'Global theme gray color',
      defaultValue: getMatchingGrayColor('blue'),
      toolbar: {
        icon: 'mirror',
        items: grayColors.filter((color) => color !== 'auto').map((color) => ({ value: color, title: color })),
        showName: true
      }
    },
    radius: {
      name: 'Radius color',
      description: 'Global theme radius color',
      defaultValue: 'medium',
      toolbar: {
        icon: 'button',
        items: radii.map((value) => ({ value: value, title: value })),
        showName: true
      }
    },
    scaling: {
      name: 'Scaling',
      description: 'Global theme scaling',
      defaultValue: '100%',
      toolbar: {
        icon: 'category',
        items: scalings.map((value) => ({ value: value, title: value })),
        showName: true
      }
    }
  },
  decorators: [
    withSource,
    // @ts-ignore
    withAxiosDecorator(axiosInstance),
    withThemeProvider,
    withQueryClientProvider
  ]
}

export default preview
