import React from 'react'
import { Story } from '@storybook/react'
import { Counter } from '../src'

export default {
  title: 'React/Counter'
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzA5NDc5OTIsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjcwOTUxNTkyLCJpYXQiOjE2NzA5NDc5OTIsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiNDRlMTQyMTEtN2FjYy00N2Q0LWE5MDAtNzc2YmYxOGFmNzk5IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxR0paRzIyNlk3SFlISjNGQkg1NzAwR1I5Iiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.gxh6xQaMAGfWgwUR2_YIteGjCbLSz4L_h7U-1CQPypg'

const Template: Story = (args) => <Counter {...args} />

export const Dumb = Template.bind({})
Dumb.args = {
  value: '150'
}

export const Smart = Template.bind({})
Smart.args = {
  accessToken,
  metric: 'queryCount'
}

export const PrefixAndSufix = Template.bind({})
PrefixAndSufix.args = {
  value: '123',
  prefixValue: '$',
  sufixValue: '%'
}
