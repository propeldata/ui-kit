import type { Meta, StoryObj } from '@storybook/react'
import type { MetricInput } from '../index'

export const MetricInputComponent: React.FC<MetricInput> = () => null

const meta = {
  title: 'API/MetricInput',
  tags: ['pattern'],
  component: MetricInputComponent,
  argTypes: {
    average: {
      control: 'AverageMetricQueryInput',
      description: 'An ad hoc Average Metric.'
    },
    count: {
      control: 'CountMetricQueryInput',
      description: 'An ad hoc Count Metric.'
    },
    countDistinct: {
      control: 'CountDistinctMetricQueryInput',
      description: 'An ad hoc Count Distinct Metric.'
    },
    custom: {
      control: 'CustomMetricQueryInput',
      description: 'An ad hoc Custom Metric.'
    },
    id: {
      control: 'string',
      description: 'The ID of a pre-configured Metric.'
    },
    max: {
      control: 'MaxMetricQueryInput',
      description: 'An ad hoc Max Metric.'
    },
    min: {
      control: 'MinMetricQueryInput',
      description: 'An ad hoc Min Metric.'
    },
    name: {
      control: 'string',
      description: 'The name of a pre-configured Metric.'
    },
    sum: {
      control: 'SumMetricQueryInput',
      description: 'An ad hoc Sum Metric.'
    }
  }
} satisfies Meta<typeof MetricInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MetricInputStory: StoryObj<typeof meta> = {}
