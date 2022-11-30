import { html } from 'lit'
import '../../packages/time-series/dist/esm/index.js'

export default {
  title: 'WebComponents/TimeSeries',
  component: 'wc-time-series'
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

const Template = () => html` <wc-time-series .labels=${labels} .values=${values}></wc-time-series> `

export const Default = Template.bind({})
