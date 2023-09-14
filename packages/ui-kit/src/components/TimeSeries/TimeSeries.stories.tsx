import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../helpers'
import { TimeSeries, TimeSeriesComponent } from './TimeSeries'

const meta: Meta<typeof TimeSeriesComponent> = {
  title: 'Components/TimeSeries',
  component: TimeSeriesComponent,
  render: (args) => <TimeSeries {...args} />
}

export default meta

type Story = StoryObj<typeof TimeSeriesComponent>

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

export const LineVariantStory: Story = {
  name: 'Line variant',
  args: {
    variant: 'line',
    ...dataset
  }
}

export const BarVariantStory: Story = {
  name: 'Bar variant',
  args: {
    variant: 'bar',
    ...dataset
  }
}

export const ConnectedStory: Story = {
  name: 'Connected',
  args: {
    variant: 'line',
    query: {
      accessToken: process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
      metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      },
      granularity: TimeSeriesGranularity.Week
    }
  }
}

export const CustomStyleStory: Story = {
  name: 'Custom style',
  tags: ['pattern'],
  args: {
    variant: 'bar',
    styles: {
      bar: {
        backgroundColor: '#532AB4'
      }
    },
    ...dataset
  }
}

export const CustomChartStory: Story = {
  name: 'Custom chart',
  tags: ['pattern'],
  args: {
    variant: 'line',
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
    },
    ...dataset
  }
}

export const ErrorStory: Story = {
  name: 'Error',
  tags: ['pattern'],
  args: {
    error: {
      title: 'Unable to connect',
      body: 'Sorry we are not able to connect at this time due to a technical error.'
    }
  }
}
