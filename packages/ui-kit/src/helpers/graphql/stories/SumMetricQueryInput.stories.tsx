import type { Meta, StoryObj } from '@storybook/react'
import type { SumMetricQueryInput } from '../index'

export const SumMetricQueryInputComponent: React.FC<SumMetricQueryInput> = () => null

const meta = {
  title: 'API/SumMetricQueryInput',
  tags: ['hidden'],
  component: SumMetricQueryInputComponent
} satisfies Meta<typeof SumMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const SumMetricQueryInputStory: StoryObj<typeof meta> = {}
