import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { ThemeProvider } from './ThemeProvider'
import './ThemeProvider.stories.css'
import rawThemeProviderStoriesScss from '!!raw-loader!./ThemeProvider.stories.css'
import { Counter as CounterSource } from '../Counter'
import { Leaderboard as LeaderboardSource } from '../Leaderboard'

const meta: Meta<typeof ThemeProvider> = {
  title: 'API/ThemeProvider',
  component: ThemeProvider,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'ThemeProvider, Counter',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof ThemeProvider>

// @TODO: fix any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Counter = (args: any) => <CounterSource {...args} />

// @TODO: fix any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Leaderboard = (args: any) => <LeaderboardSource {...args} />

export const ThemeProviderCustomizeViaCssClassNameStory: Story = {
  name: 'ThemeProvider customize via css class name',
  tags: ['pattern'],
  parameters: {
    rawCss: `
      // my-themes.css

      ${rawThemeProviderStoriesScss}
    `,
    codeTemplate: (body: string): string => `
      // App.tsx
      
      import { ThemeProvider, Counter } from '@propeldata/ui-kit'
      import './my-themes.css'

      function App() {
        return (
          ${body}
        )
      }
    `
  },
  args: {
    theme: 'customTheme'
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <Counter value="10000" card localize />
    </ThemeProvider>
  )
}

export const ThemeProviderCustomizeViaJSPropsStory: Story = {
  name: 'ThemeProvider customize via js props',
  tags: ['pattern'],
  args: {
    theme: {
      textPrimary: '#532ab4',
      radiusSm: '20px'
    }
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <Counter value="10000" card localize />
    </ThemeProvider>
  )
}

export const ThemeProviderChartConfigStory: Story = {
  name: 'ThemeProvider customize chart config',
  tags: ['pattern'],
  args: {
    globalChartConfigProps: (chartConfig) => {
      chartConfig.options = {
        ...chartConfig.options,
        plugins: {
          ...chartConfig.options?.plugins,
          tooltip: {
            ...chartConfig.options?.plugins?.tooltip,
            backgroundColor: '#532ab4',
            titleColor: '#ffffff',
            borderWidth: 3
          }
        }
      }
      return chartConfig
    }
  },
  parameters: {
    skipThemeProvider: true
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <Leaderboard
        headers={['Book title', 'Total sold']}
        rows={[
          ["John's way or Highway", '12863002'],
          ['How to Speak Native Animal', '7865371'],
          ['Cell Lost in a Sea of Desert', '622027'],
          ['Flying nowhere special', '462791'],
          ['The Lean Product Book', '1']
        ]}
      />
    </ThemeProvider>
  )
}
