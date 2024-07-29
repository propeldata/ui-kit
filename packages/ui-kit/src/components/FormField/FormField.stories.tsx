import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { FormField } from './FormField'
import { Input } from '../Input'

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'FormField, Input',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof FormField>

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    label: 'FormField Label'
  },
  render: (args) => (
    <FormField {...args}>
      <Input size="small" />
    </FormField>
  )
}
