import React from 'react'
import { Story } from '@storybook/react'

import { Container as TimeSeries } from './Container'
import { TimeSeriesProps } from './TimeSeries'

export default {
  title: 'React/TimeSeries'
}

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

const Template: Story<TimeSeriesProps> = (args) => <TimeSeries {...args} />

export const Bar = Template.bind({})
Bar.args = {
  variant: 'bar',
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
  values,
  styles: {
    line: {
      borderColor: '#1E293B'
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

export const IngestionActivity = Template.bind({})
IngestionActivity.args = {
  variant: 'line',
  labels,
  values,
  styles: {
    line: {
      tension: 0.1,
      borderColor: '#17B897',
      borderWidth: 8
    },
    point: {
      style: 'line'
    },
    canvas: {
      width: 100,
      height: 45,
      backgroundColor: 'transparent',
      hideGridLines: true
    }
  }
}

export const Error = Template.bind({})
Error.args = {
  query: {
    accessToken: ''
  }
}
