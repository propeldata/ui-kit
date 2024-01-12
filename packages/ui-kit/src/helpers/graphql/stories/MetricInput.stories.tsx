import type { Meta, StoryObj } from '@storybook/react'
import type { MetricInput } from '../index'

export const MetricInputComponent: React.FC<MetricInput> = () => null

const meta = {
  title: 'API/MetricInput',
  tags: ['pattern'],
  component: MetricInputComponent,
  argTypes: {
    average: {
      description: 'An ad hoc Average Metric.'
    },
    count: {
      description: 'An ad hoc Count Metric.'
    },
    countDistinct: {
      description: 'An ad hoc Count Distinct Metric.'
    },
    custom: {
      description: 'An ad hoc Custom Metric.'
    },
    id: {
      description: 'The ID of a pre-configured Metric.'
    },
    max: {
      description: 'An ad hoc Max Metric.'
    },
    min: {
      description: 'An ad hoc Min Metric.'
    },
    name: {
      description: 'The name of a pre-configured Metric.'
    },
    sum: {
      description: 'An ad hoc Sum Metric.'
    }
  }
} satisfies Meta<typeof MetricInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MetricInputStory: StoryObj<typeof meta> = {}
