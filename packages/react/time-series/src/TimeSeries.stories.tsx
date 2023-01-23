import React from 'react'
import { Story } from '@storybook/react'

import { Container as TimeSeries } from './Container'
import { TimeSeriesProps } from './TimeSeries'
import { RelativeTimeRange, TimeSeriesGranularity } from './'

export default {
  title: 'React/TimeSeries'
}

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

const Template: Story<TimeSeriesProps> = (args) => <TimeSeries {...args} />

export const UnstyledBar = Template.bind({})
UnstyledBar.args = {
  variant: 'bar',
  labels,
  values
}

export const UnstyledLine = Template.bind({})
UnstyledLine.args = {
  variant: 'line',
  labels,
  values
}

export const Smart = Template.bind({})
Smart.args = {
  variant: 'line',
  query: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzQzNTA5MzQsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjc0MzU0NTM1LCJpYXQiOjE2NzQzNTA5MzUsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiNDQ2MTAzZjYtOTJkOC00NmYyLWFlYTMtMTJmYzNhZDE1YWM4IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxRlgzNjA2UjJLUUZRWVhYMzRBOTZRNlpSIiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.9ouiMQKmvW_4u_F3RMrf7AphztXgIrhVCOh0IWQ2fT0',
    metric: 'syncRecordsAdded',
    timeRange: {
      relative: RelativeTimeRange.PreviousWeek
    },
    granularity: TimeSeriesGranularity.Day,
    timestampFormat: 'MM/dd/yyyy'
  }
}

export const Error = Template.bind({})
Error.args = {}

export const Loading = () => {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return <TimeSeries loading={loading} labels={labels} values={values} />
}

export const CustomStyles = Template.bind({})
CustomStyles.args = {
  variant: 'line',
  labels,
  values,
  styles: {
    line: {
      tension: 0.1,
      borderColor: '#17B897',
      borderWidth: 3
    },
    point: {
      style: false
    },
    canvas: {
      width: 100,
      height: 45,
      backgroundColor: 'transparent',
      hideGridLines: true
    }
  }
}

export const CustomDark = Template.bind({})
CustomDark.args = {
  variant: 'line',
  labels,
  values,
  styles: {
    canvas: {
      width: 400,
      backgroundColor: '#212121',
      borderRadius: '0.5rem',
      padding: 18
    },
    line: {
      backgroundColor: '#1db954',
      borderColor: '#1db954'
    },
    font: {
      color: '#f0f2f0'
    }
  }
}
