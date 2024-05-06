import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../../helpers'
import { DateTimeField } from './DateTimeField'

const meta: Meta<typeof DateTimeField> = {
  title: 'Components/DateTimeField',
  component: DateTimeField,
  tags: ['devOnly'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'DateTimeField',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof DateTimeField>

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    style: { width: 400 }
  },
  render: (args) => <DateTimeField {...args} />
}
