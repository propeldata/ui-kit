import { Story } from '@storybook/react'
import React from 'react'

import { TimeSeries } from '../src'
import { RelativeTimeRange } from '../src/types'

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

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzA5NDc5OTIsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjcwOTUxNTkyLCJpYXQiOjE2NzA5NDc5OTIsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiNDRlMTQyMTEtN2FjYy00N2Q0LWE5MDAtNzc2YmYxOGFmNzk5IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxR0paRzIyNlk3SFlISjNGQkg1NzAwR1I5Iiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.gxh6xQaMAGfWgwUR2_YIteGjCbLSz4L_h7U-1CQPypg'

const Template: Story = (args) => <TimeSeries {...args} />
export const Dumb = Template.bind({})
Dumb.args = {
  labels,
  values
}

export const Smart = Template.bind({})
Smart.args = {
  accessToken,
  metric: 'queryCount',
  RelativeTimeRange: RelativeTimeRange.LastNDays,
  n: 7
}

export const Line = Template.bind({})
Line.args = {
  variant: 'line',
  labels,
  values
}
