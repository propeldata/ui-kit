import React from 'react'
import { Story } from '@storybook/react'

import { TimeSeries } from '../src'

export default {
  title: 'React/TimeSeries'
}

const labels = [
  '2022-10-25T00:00:00.000Z',
  '2022-10-26T00:00:00.000Z',
  '2022-10-27T00:00:00.000Z',
  '2022-10-28T00:00:00.000Z',
  '2022-10-29T00:00:00.000Z',
  '2022-10-30T00:00:00.000Z',
  '2022-10-31T00:00:00.000Z'
]

const values = ['0', '100', '200', '300', '400', '500', '700']

const Template: Story = (args) => <TimeSeries {...args} />
export const Default = Template.bind({})
Default.args = {
  labels,
  values
}

export const Line = Template.bind({})
Line.args = {
  variant: 'line',
  labels,
  values
}
