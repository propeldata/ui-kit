import React from 'react'
import { Story } from '@storybook/react'

import { TimeSeries, Props } from './TimeSeries'

export default {
  title: 'React/TimeSeries'
}

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 100, 200, 300, 400, 500, 700]

const Template: Story<Props> = (args) => <TimeSeries {...args} />

export const Default = Template.bind({})
Default.args = {
  labels,
  values,
  styles: {
    bar: {
      thickness: 20,
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#94A3B8',
      hoverBorderColor: '#64748B',
      backgroundColor: '#CBD5E1',
      hoverBackgroundColor: '#64748B'
    },
    canvas: {
      backgroundColor: '#ffffff',
      padding: 12,
      borderRadius: '0px'
    },
    font: {
      color: '#475569',
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      weight: '500',
      style: 'normal',
      lineHeight: 1
    }
  }
}

export const Line = Template.bind({})
Line.args = {
  variant: 'line',
  labels,
  values
}
