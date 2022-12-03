import React from 'react'
import '@propeldata/wc-time-series'

export default {
  title: 'wc-time-series'
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

const Template = () => <wc-time-series labels={JSON.stringify(labels)} values={JSON.stringify(values)}></wc-time-series>

export const Basic = Template.bind({})
