import type { Meta, StoryObj } from '@storybook/react'
import { RelativeTimeRange } from '../../helpers'
import type { DateRangeOptionValue } from './TimeRangePicker.types'

export const DateRangeOptionValueComponent: React.FC<DateRangeOptionValue> = () => null

const meta = {
  title: 'API/DateRangeOptionValue',
  tags: ['pattern'],
  component: DateRangeOptionValueComponent
} satisfies Meta<typeof DateRangeOptionValueComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {
  args: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  }
}
