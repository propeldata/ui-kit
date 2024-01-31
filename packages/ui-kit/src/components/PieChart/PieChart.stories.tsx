import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import {
  quotedStringRegex,
  RelativeTimeRange,
  Sort,
  storybookCodeTemplate,
  useStorybookAccessToken
} from '../../helpers'
import { ThemeTokenProps } from '../../themes'
import { DefaultThemes, ThemeProvider } from '../ThemeProvider'
import { PieChart as PieChartSource, PieChartComponent } from './PieChart'

const meta: Meta<typeof PieChartComponent> = {
  title: 'Components/PieChart',
  component: PieChartComponent,
  argTypes: {
    baseTheme: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'PieChart, RelativeTimeRange',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof PieChartComponent>

const pieHeaders = ['Taco name', 'value']
const pieRows = [
  ['Carnitas', '21250'],
  ['Al Pastor', '14385'],
  ['Carne Asada', '8445'],
  ['Pollo', '15600'],
  ['Barbacoa', '5560'],
  ['Veggie', '11320'],
  ['Other', '11000']
]
const PieChart = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)
  const ref = React.useRef(null)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <PieChartSource
      ref={ref}
      {...{
        ...args,
        query: args?.query
          ? {
              ...args?.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

const connectedParams = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  rowLimit: 5,
  dimension: {
    columnName: process.env.STORYBOOK_DIMENSION_1 as string
  },
  sort: Sort.Asc
}

export const SingleDimensionPieStory: Story = {
  name: 'Pie',
  args: {
    query: connectedParams,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const SingleDimensionDoughnutStory: Story = {
  name: 'Doughnut',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const PieLegendBottomStory: Story = {
  name: 'Pie legend on bottom',
  args: {
    query: connectedParams,
    chartProps: {
      legendPosition: 'bottom'
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const DoughnutLegendBottomStory: Story = {
  name: 'Doughnut legend on bottom',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    chartProps: {
      legendPosition: 'bottom'
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const StaticPieStory: Story = {
  name: 'Static Pie with values',
  args: {
    headers: pieHeaders,
    rows: pieRows,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const StaticDoughnutStory: Story = {
  name: 'Static Doughnut with values',
  args: {
    variant: 'doughnut',
    headers: pieHeaders,
    rows: pieRows,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const DoughnutIsLegendHiddenStory: Story = {
  name: 'Legend is hidden',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    chartProps: {
      hideLegend: true
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const DoughnutIsTotaldHiddenStory: Story = {
  name: 'Doughnut total is hidden',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    chartProps: {
      hideTotal: true
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const PieIsTotaldHiddenStory: Story = {
  name: 'Pie total is hidden',
  args: {
    query: connectedParams,
    chartProps: {
      hideTotal: true
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const PieTotalPositionStory: Story = {
  name: 'Pie total on top',
  args: {
    query: connectedParams,
    chartProps: {
      totalPosition: 'top'
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const ChangeOtherLabelStory: Story = {
  name: 'Other label text',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    chartProps: {
      otherLabel: 'Rest'
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const ShowValuesPieChartStory: Story = {
  name: 'Show values for Pie',
  args: {
    headers: pieHeaders,
    rows: pieRows,
    chartProps: {
      showValues: true
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const ShowValuesDoughnutStory: Story = {
  name: 'Show values for Dounghnut',
  args: {
    variant: 'doughnut',
    headers: pieHeaders,
    rows: pieRows,
    chartProps: {
      showValues: true
    },
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const ThemeStory: Story = {
  name: 'Theme',
  args: {
    variant: 'pie',
    headers: pieHeaders,
    rows: pieRows,
    card: true
  },
  decorators: [
    (Story) => {
      const [baseTheme, setBaseTheme] = useState<DefaultThemes>('lightTheme')

      const lightColors: ThemeTokenProps = {
        colorBlue950: '#1a1919',
        colorBlue900: '#2D3748',
        colorBlue800: '#4A5568',
        colorBlue700: '#718096',
        colorBlue600: '#A0AEC0',
        colorBlue500: '#CBD5E0',
        colorBlue400: '#E2E8F0',
        colorBlue300: '#EDF2F7',
        colorBlue200: '#F7FAFC',
        colorBlue100: '#FFFFFF'
      }

      const darkColors: ThemeTokenProps = {
        colorBlue950: '#d9d9d9',
        colorBlue900: '#F7FAFC',
        colorBlue800: '#EDF2F7',
        colorBlue700: '#E2E8F0',
        colorBlue600: '#CBD5E0',
        colorBlue500: '#A0AEC0',
        colorBlue400: '#718096',
        colorBlue300: '#4A5568',
        colorBlue200: '#2D3748',
        colorBlue100: '#1a1919'
      }

      const theme = baseTheme === 'darkTheme' ? darkColors : lightColors

      return (
        <ThemeProvider baseTheme={baseTheme} theme={theme}>
          <div style={{ margin: '10px', display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setBaseTheme(baseTheme === 'darkTheme' ? 'lightTheme' : 'darkTheme')}>
              Switch theme
            </button>
            <span>{baseTheme}</span>
          </div>
          <Story />
        </ThemeProvider>
      )
    }
  ],
  render: (args) => <PieChart {...args} />
}
