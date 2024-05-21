import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { Select as SelectSource } from './Select'
import { Option } from './Option'

const meta: Meta<typeof SelectSource> = {
  title: 'Components/Select',
  component: SelectSource,
  tags: ['devOnly'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Select',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof SelectSource>

const options = [
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' }
]

const Select = (args: Story['args']) => {
  const [value, setValue] = React.useState(args?.value ?? null)

  return (
    <div style={{ display: 'block' }}>
      <SelectSource {...args} value={value} onChange={(_, val) => setValue(val)} />
    </div>
  )
}

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    children: options.map((option) => (
      <Option key={option.value} value={option}>
        {option.label}
      </Option>
    )),
    placeholder: 'Select an option'
  },
  render: (args) => <Select {...args} />
}

export const SmallStory: Story = {
  name: 'Small',
  args: {
    children: options.map((option) => (
      <Option key={option.value} value={option}>
        {option.label}
      </Option>
    )),
    size: 'small',
    placeholder: 'Select an option'
  },
  render: (args) => <Select {...args} />
}
