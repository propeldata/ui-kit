import React from 'react'
import { Story } from '@storybook/react'
import { format } from 'date-fns'

import { TimeSeries, RelativeTimeRange, TimeSeriesGranularity } from '@propeldata/react-time-series'

export default {
  title: 'React/TimeSeries'
}

const dataset = {
  labels: [
    '2022-01-01T00:00:00.000Z',
    '2022-02-01T00:00:00.000Z',
    '2022-03-01T00:00:00.000Z',
    '2022-04-01T00:00:00.000Z',
    '2022-05-01T00:00:00.000Z',
    '2022-06-01T00:00:00.000Z',
    '2022-07-01T00:00:00.000Z',
    '2022-08-01T00:00:00.000Z',
    '2022-09-01T00:00:00.000Z',
    '2022-10-01T00:00:00.000Z',
    '2022-11-01T00:00:00.000Z',
    '2022-12-01T00:00:00.000Z',
    '2023-01-01T00:00:00.000Z',
    '2023-02-01T00:00:00.000Z',
    '2023-03-01T00:00:00.000Z',
    '2023-04-01T00:00:00.000Z',
    '2023-05-01T00:00:00.000Z',
    '2023-06-01T00:00:00.000Z',
    '2023-07-01T00:00:00.000Z',
    '2023-08-01T00:00:00.000Z'
  ],
  values: [809, 984, 673, 530, 522, 471, 872, 578, 825, 619, 38, 326, 128, 615, 844, 58, 576, 28, 663, 189]
}

const Template: Story = (args) => <TimeSeries {...args} />

export const UnstyledBar = Template.bind({})
UnstyledBar.args = {
  variant: 'bar',
  ...dataset
}

export const UnstyledLine = Template.bind({})
UnstyledLine.args = {
  variant: 'line',
  ...dataset
}

export const Connected = Template.bind({})
Connected.args = {
  variant: 'line',
  query: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: 'queryCount',
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    },
    granularity: TimeSeriesGranularity.Week
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
      setLocalLabels(dataset.labels)
      setLocalValues(dataset.values)
    }, 1000)
  }, [])

  return <TimeSeries loading={loading} labels={localLabels} values={localValues} />
}

export const CustomStyles = Template.bind({})
CustomStyles.args = {
  variant: 'line',
  ...dataset,
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
  ...dataset,
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

export const FormattedLabels = Template.bind({})
FormattedLabels.args = {
  variant: 'bar',
  ...dataset,
  labelFormatter: (labels: string[]) => {
    return labels.map((label) => {
      return format(new Date(label), 'MM/dd/yy')
    })
  }
}
