import type { Meta, StoryObj } from '@storybook/react'
import type { DateRangeOptionsProps } from './TimeRangePicker.types'

export const DateRangeOptionsPropsComponent: React.FC<DateRangeOptionsProps> = () => null

const meta = {
  title: 'API/DateRangeOptionsProps',
  tags: ['hidden'],
  component: DateRangeOptionsPropsComponent
} satisfies Meta<typeof DateRangeOptionsPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {
  args: {
    uid: '',
    label: '',
    value: undefined
  }
}
