import type { Meta, StoryObj } from '@storybook/react'
import type { CustomMetricQueryInput } from '../index'

export const CustomMetricQueryInputComponent: React.FC<CustomMetricQueryInput> = () => null

const meta = {
  title: 'API/CustomMetricQueryInput',
  tags: ['pattern'],
  component: CustomMetricQueryInputComponent
} satisfies Meta<typeof CustomMetricQueryInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const CustomMetricQueryInputStory: StoryObj<typeof meta> = {}
