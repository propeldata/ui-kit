import type { Meta, StoryObj } from '@storybook/react'
import type { CountDistinctMetricQueryInput } from '../index'

export const CountDistinctMetricQueryInputComponent: React.FC<CountDistinctMetricQueryInput> = () => null

const meta = {
  title: 'API/CountDistinctMetricQueryInput',
  tags: ['hidden'],
  component: CountDistinctMetricQueryInputComponent
} satisfies Meta<typeof CountDistinctMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const CountDistinctMetricQueryInputStory: StoryObj<typeof meta> = {}
