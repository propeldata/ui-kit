import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Typography',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof Typography>

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    size: 2
  },
  render: (args) => (
    <div>
      <Typography {...args}>UI Kit Storybook</Typography>
    </div>
  )
}

export const BigStory: Story = {
  name: 'Big size',
  args: {
    size: 8
  },
  render: (args) => (
    <div>
      <Typography {...args}>UI Kit Storybook</Typography>
    </div>
  )
}
