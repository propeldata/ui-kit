import type { Meta, StoryObj } from '@storybook/react'
import type { TimeRangeInput } from '../index'

export const TimeRangeInputComponent: React.FC<TimeRangeInput> = () => null

const meta = {
  title: 'API/TimeRangeInput',
  tags: ['pattern'],
  component: TimeRangeInputComponent
} satisfies Meta<typeof TimeRangeInputComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
