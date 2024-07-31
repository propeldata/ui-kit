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

export const MixedWithdStory: Story = {
  name: 'Mixed with weight',
  tags: ['hidden'],
  render: (args) => (
    <div>
      <Typography as="h2" size={6} weight="bold">
        Typographic principles
      </Typography>
      <Typography as="p" size={2}>
        The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes
        beauty and makes reading easier and more pleasant.
      </Typography>
    </div>
  )
}
