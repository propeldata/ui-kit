import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
// import './Counter.stories.css'
// import axiosInstance from '../../../../../app/storybook/src/axios'
// import { quotedStringRegex, RelativeTimeRange, storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'
import { TimeRangePicker as TimeRangePickerSource } from './TimeRangePicker'
// import { CounterProps } from './Counter.types'

const meta: Meta<typeof TimeRangePickerSource> = {
  title: 'Components/TimeRangePicker',
  component: TimeRangePickerSource,
  tags: ['tag'],
  argTypes: {
    // baseTheme: {
    //   table: {
    //     disable: true
    //   }
    // }
  }
  // parameters: {
  //   controls: { sort: 'alpha' },
  //   imports: 'Counter, RelativeTimeRange',
  //   transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
  //   codeTemplate: storybookCodeTemplate
  // }
}

export default meta

type Story = StoryObj<typeof TimeRangePickerSource>

const TimeRangePicker = (args: Story['args']) => {
  return <TimeRangePickerSource />
}

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    // card: true
  },
  render: (args) => <TimeRangePicker {...args} />
}
