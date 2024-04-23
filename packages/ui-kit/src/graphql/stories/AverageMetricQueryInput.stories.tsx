import type { Meta, StoryObj } from '@storybook/react'
import type { AverageMetricQueryInput } from '../index'

export const AverageMetricQueryInputComponent: React.FC<AverageMetricQueryInput> = () => null

const meta = {
  title: 'API/AverageMetricQueryInput',
  tags: ['hidden'],
  component: AverageMetricQueryInputComponent
} satisfies Meta<typeof AverageMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const AverageMetricInputStory: StoryObj<typeof meta> = {}
