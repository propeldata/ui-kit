import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { FilterOperator, RelativeTimeRange, Sort } from '../../graphql'
import { quotedStringRegex, storybookCodeTemplate } from '../../helpers'
import { useStorybookAccessToken } from '../../helpers/useStorybookAccessToken'
import { PieChart as PieChartSource, PieChartComponent } from './PieChart'
import { PieChartQueryProps } from './PieChart.types'

const meta: Meta<typeof PieChartComponent> = {
  title: 'Components/PieChart',
  component: PieChartComponent,
  argTypes: {
    appearance: {
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

const connectedParams: PieChartQueryProps = {
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

export const MultiDimensionPieStory: Story = {
  name: 'Multi Dimension Pie',
  args: {
    query: {
      ...connectedParams,
      dimensions: [{ columnName: 'taco_name' }, { columnName: 'tortilla_name' }]
    },
    showGroupByOther: false,
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

export const DoughnutValuesRightStory: Story = {
  name: 'Doughnut values right',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    card: true,
    chartConfigProps: (config) => ({
      ...config,
      options: {
        ...config.options,
        plugins: {
          ...config.plugins,
          legend: {
            position: 'right'
          }
        }
      }
    })
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

export const EmptyPieStory: Story = {
  name: 'Empty State',
  args: {
    query: {
      ...connectedParams,
      filters: [
        {
          column: process.env.STORYBOOK_DIMENSION_3 ?? '',
          operator: FilterOperator.IsNull
        }
      ]
    },
    card: true,
    variant: 'pie'
  },
  render: (args) => <PieChart {...args} />
}
