import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, TimeSeriesGranularity, useStorybookAccessToken } from '../../helpers'
import { TimeSeries as TimeSeriesSource, TimeSeriesComponent } from './TimeSeries'

const meta: Meta<typeof TimeSeriesComponent> = {
  title: 'Components/TimeSeries',
  component: TimeSeriesComponent,
  render: (args) => <TimeSeries {...args} />,
  parameters: { controls: { sort: 'alpha' } },
  excludeStories: ['codeTemplate']
}

export default meta

type Story = StoryObj<typeof TimeSeriesComponent>

export const codeTemplate = (body, imports = 'TimeSeries, RelativeTimeRange, TimeSeriesGranularity') => `
  import { ${imports} } from '@propeldata/ui-kit'

  function TimeSeriesComponent() {
    return (
      ${body.replace("'LAST_N_DAYS'", 'RelativeTimeRange.LastNDays').replace("'WEEK'", 'TimeSeriesGranularity.Week')}
    )
  }
`

const dataset = {
  labels: [
    '2022-01-01T00:00:00.000Z',
    '2022-02-01T00:00:00.000Z',
    '2022-03-01T00:00:00.000Z',
    '2022-04-01T00:00:00.000Z',
    '2022-05-01T00:00:00.000Z',
    '2022-06-01T00:00:00.000Z',
    '2022-07-01T00:00:00.000Z',
    '2022-08-01T00:00:00.000Z',
    '2022-09-01T00:00:00.000Z',
    '2022-10-01T00:00:00.000Z',
    '2022-11-01T00:00:00.000Z',
    '2022-12-01T00:00:00.000Z',
    '2023-01-01T00:00:00.000Z',
    '2023-02-01T00:00:00.000Z',
    '2023-03-01T00:00:00.000Z',
    '2023-04-01T00:00:00.000Z',
    '2023-05-01T00:00:00.000Z',
    '2023-06-01T00:00:00.000Z',
    '2023-07-01T00:00:00.000Z',
    '2023-08-01T00:00:00.000Z'
  ],
  values: [809, 984, 673, 530, 522, 471, 872, 578, 825, 619, 38, 326, 128, 615, 844, 58, 576, 28, 663, 189]
}

const connectedParams = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  granularity: TimeSeriesGranularity.Week
}

const TimeSeries = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(
    axiosInstance,
    process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
    process.env.STORYBOOK_TOKEN_URL
  )

  if (accessToken === '' || accessToken === undefined) {
    return null
  }

  return (
    <TimeSeriesSource
      {...{
        ...args,
        query: {
          ...args?.query,
          accessToken
        }
      }}
    />
  )
}

export const LineVariantStory: Story = {
  name: 'Line variant',
  args: {
    variant: 'line',
    query: connectedParams
  }
}

export const BarVariantStory: Story = {
  name: 'Bar variant',
  args: {
    variant: 'bar',
    query: connectedParams
  }
}

export const CustomChartStory: Story = {
  name: 'Custom chart',
  tags: ['pattern'],
  args: {
    variant: 'line',
    query: connectedParams,
    styles: {
      line: {
        tension: 0.1,
        borderColor: '#17B897',
        borderWidth: 3
      },
      point: {
        style: false
      },
      canvas: {
        width: 100,
        height: 45,
        backgroundColor: 'transparent',
        hideGridLines: true
      }
    }
  }
}

export const CustomStyleStory: Story = {
  name: 'Custom style',
  tags: ['pattern'],
  args: {
    variant: 'bar',
    query: connectedParams,
    styles: {
      bar: {
        backgroundColor: '#532AB4'
      }
    }
  }
}

export const StaticStory: Story = {
  name: 'Static',
  args: {
    variant: 'line',
    ...dataset
  },
  render: (args) => <TimeSeriesSource {...args} />
}

export const ErrorStory: Story = {
  name: 'Error',
  tags: ['pattern'],
  args: {
    error: {
      title: 'Unable to connect',
      body: 'Sorry we are not able to connect at this time due to a technical error.'
    }
  },
  render: (args) => <TimeSeriesSource {...args} />
}
