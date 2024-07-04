import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { ChevronUpIcon } from '../Icons/ChevronUp'
import { ChevronDownIcon } from '../Icons/ChevronDown'
import { Button as ButtonSource } from './Button'

const meta: Meta<typeof ButtonSource> = {
  title: 'Components/Button',
  component: ButtonSource,
  tags: ['devOnly'],
  argTypes: {
    appearance: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Button',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof ButtonSource>

const Button = (args: Story['args']) => {
  return (
    <div style={{ display: 'block' }}>
      <ButtonSource {...args} />
    </div>
  )
}

export const DefaultStory: Story = {
  name: 'Default',
  render: (args) => <Button {...args}>Button Tex</Button>
}

export const PrimaryStory: Story = {
  name: 'Primary',
  args: {
    variant: 'primary'
  },
  render: (args) => <Button {...args}>Button Tex</Button>
}

export const DisabledStory: Story = {
  name: 'Disabled',
  args: {
    disabled: true
  },
  render: (args) => <Button {...args}>Button Tex</Button>
}

export const AdornmentsStory: Story = {
  name: 'Adornments',
  args: {
    style: { width: 200 },
    startAdornment: () => <ChevronUpIcon />,
    endAdornment: () => <ChevronDownIcon />
  },
  render: (args) => <Button {...args}>Button Tex</Button>
}

export const SmallStory: Story = {
  name: 'Small',
  args: {
    size: 'small'
  },
  render: (args) => <Button {...args}>Button Tex</Button>
}

export const SmallAdornmentsStory: Story = {
  name: 'Small Adornments',
  args: {
    size: 'small',
    startAdornment: () => <ChevronUpIcon />,
    endAdornment: () => <ChevronDownIcon />
  },
  render: (args) => <Button {...args}>Button Tex</Button>
}
