import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Card',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof Card>

export const DefaultStory: Story = {
  name: 'Default',
  args: {},
  render: (args) => <Card {...args}>Card content</Card>
}
