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

export const Connected = Template.bind({})
Connected.args = {
  variant: 'line',
  query: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: 'syncRecordsAdded',
    timeRange: {
      relative: RelativeTimeRange.PreviousMonth
    },
    granularity: TimeSeriesGranularity.Day
  }
}

export const Error = Template.bind({})
Error.args = {
  query: {}
}

export const Loading = () => {
  const [loading, setLoading] = React.useState(true)
  const [localLabels, setLocalLabels] = React.useState<string[]>()
  const [localValues, setLocalValues] = React.useState<number[]>()

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setLocalLabels(labels)
      setLocalValues(values)
    }, 1000)
  }, [])

  return <TimeSeries loading={loading} labels={localLabels} values={localValues} />
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
    },
    tooltip: {
      display: false
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
    },
    tooltip: {
      color: '#1db954',
      borderColor: '#ffffff',
      backgroundColor: '#212121'
    }
  }
}
