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

const DumbTemplate = () => <TimeSeries labels={labels} values={values} />
export const Dumb = DumbTemplate.bind({})

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzA4NjU1NDksImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjcwODY5MTQ5LCJpYXQiOjE2NzA4NjU1NDksImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiYWM2ODdmMGYtNGRiNy00MTE1LWFkZjAtNGVmNjE0MjRlM2Y3IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxR0paRzIyNlk3SFlISjNGQkg1NzAwR1I5Iiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.8ujgTqdFmMTqWMyXWkHl7TW-tHgTFd_RS38qZEb6YYk'

const SmartTemplate = () => (
  <TimeSeries accessToken={accessToken} metric="queryCount" relativeTimeRange={RelativeTimeRange.LastNDays} n={7} />
)
export const Smart = SmartTemplate.bind({})

const LineTemplate = () => <TimeSeries variant="line" labels={labels} values={values} />
export const Line = LineTemplate.bind({})
