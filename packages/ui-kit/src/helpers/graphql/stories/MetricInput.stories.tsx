import type { Meta, StoryObj } from '@storybook/react'
import type { MetricInput } from '../index'

export const MetricInputComponent: React.FC<MetricInput> = () => null

const meta = {
  title: 'API/MetricInput',
  tags: ['pattern'],
  component: MetricInputComponent
} satisfies Meta<typeof MetricInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MetricInputStory: StoryObj<typeof meta> = {}
