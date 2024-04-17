import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { Select as SelectSource } from './Select'

const meta: Meta<typeof SelectSource> = {
  title: 'Components/Select',
  component: SelectSource,
  tags: ['pattern'],
  // argTypes: {
  //   baseTheme: {
  //     table: {
  //       disable: true
  //     }
  //   }
  // },
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
      <SelectSource
        {...args}
        value={value}
        onChange={(_, value) => {
          const option = options.find((option) => option.value === value)
          if (option) {
            setValue(option.label)
          }
        }}
      />
    </div>
  )
}

export const DefaultStory: Story = {
  name: 'Default',
  args: {
    options,
    // children: [
    //   <Option key="today" value="today">
    //     Today
    //   </Option>,
    //   <Option key="tomorrow" value="tomorrow">
    //     Tomorrow
    //   </Option>
    // ],
    // value: 'Thu Mar 14 2024',
    placeholder: 'Select an option'
  },
  render: (args) => <Select {...args} />
}

export const SmallStory: Story = {
  name: 'Small',
  args: {
    options,
    size: 'small',
    placeholder: 'Select an option'
  },
  render: (args) => <Select {...args} />
}
