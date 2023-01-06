import React from 'react'
import { Story } from '@storybook/react'
import { Counter } from '../src'

export default {
  title: 'React/Counter'
}
const Template: Story = (args) => <Counter {...args} />

export const Default = Template.bind({})
Default.args = {
  value: '150'
}

export const WithPrefix = Template.bind({})
WithPrefix.args = {
  value: '123,000',
  prefixValue: '$'
}

export const WithSufix = Template.bind({})
WithSufix.args = {
  value: '99',
  sufixValue: '%'
}
