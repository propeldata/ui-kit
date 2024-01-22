import type { Meta, StoryObj } from '@storybook/react'
import type { MaxMetricQueryInput } from '../index'

export const MaxMetricQueryInputComponent: React.FC<MaxMetricQueryInput> = () => null

const meta = {
  title: 'API/MaxMetricQueryInput',
  tags: ['pattern'],
  component: MaxMetricQueryInputComponent
} satisfies Meta<typeof MaxMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MaxMetricQueryInputStory: StoryObj<typeof meta> = {}
