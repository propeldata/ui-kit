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
