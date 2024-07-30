import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { ChevronDownIcon } from '../Icons/ChevronDown'
import { Input as InputSource } from './Input'

const meta: Meta<typeof InputSource> = {
  title: 'Components/Input',
  component: InputSource,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Input',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof InputSource>

const Input = (args: Story['args']) => {
  const [value, setValue] = React.useState(args?.value)
  React.useEffect(() => {
    setValue(args?.value)
  }, [args?.value])
  return (
    <div style={{ display: 'block' }}>
      <InputSource {...args} value={value} onChange={(e) => setValue(e.currentTarget.value)} />
    </div>
  )
}

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    value: 'Input value'
  },
  render: (args) => <Input {...args} />
}

export const DisabledStory: Story = {
  name: 'Disabled',
  args: {
    value: 'Input value',
    disabled: true
  },
  render: (args) => <Input {...args} />
}

export const ErrorStory: Story = {
  name: 'Error',
  args: {
    value: 'Input value',
    error: true
  },
  render: (args) => <Input {...args} />
}

export const EndAdornmentsStory: Story = {
  name: 'End Adornment',
  args: {
    style: { width: 214 },
    value: 'Input value',
    endAdornment: () => <ChevronDownIcon />
  },
  render: (args) => <Input {...args} />
}

export const SmallStory: Story = {
  name: 'Small',
  args: {
    value: 'Input value',
    size: 'small'
  },
  render: (args) => <Input {...args} />
}

export const SmallEndAdornmentsStory: Story = {
  name: 'Small End Adornment',
  args: {
    style: { width: 183 },
    value: 'Input value',
    size: 'small',
    endAdornment: () => <ChevronDownIcon />
  },
  render: (args) => <Input {...args} />
}
