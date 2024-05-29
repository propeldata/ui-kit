import type { Meta, StoryObj } from '@storybook/react'
import type { CountMetricQueryInput } from '../index'

export const CountMetricQueryInputComponent: React.FC<CountMetricQueryInput> = () => null

const meta = {
  title: 'API/CountMetricQueryInput',
  tags: ['hidden'],
  component: CountMetricQueryInputComponent
} satisfies Meta<typeof CountMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const CountMetricQueryInputStory: StoryObj<typeof meta> = {}
