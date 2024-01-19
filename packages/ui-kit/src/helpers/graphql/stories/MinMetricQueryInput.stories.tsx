import type { Meta, StoryObj } from '@storybook/react'
import type { MinMetricQueryInput } from '../index'

export const MinMetricQueryInputComponent: React.FC<MinMetricQueryInput> = () => null

const meta = {
  title: 'API/MinMetricQueryInput',
  tags: ['pattern'],
  component: MinMetricQueryInputComponent
} satisfies Meta<typeof MinMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MinMetricQueryInputStory: StoryObj<typeof meta> = {}
