import React from 'react'
import { Counter } from '../src'

export default {
  title: 'React/Counter'
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzA4OTY4NTUsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjcwOTAwNDU1LCJpYXQiOjE2NzA4OTY4NTUsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiODUyZmQ5OTAtMWFiMy00ZDM0LTg0N2EtZjliN2NiYWQ2Y2I2IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxR0paRzIyNlk3SFlISjNGQkg1NzAwR1I5Iiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.2z0hDZldhIpmcdPafNnPhMVj9uGHXgp6WeOuBSc1ako'

const Template = () => <Counter accessToken={accessToken} metric="queryCount" styles={{}} />

export const Basic = Template.bind({})
