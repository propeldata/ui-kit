import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { endOfYesterday, startOfYesterday } from 'date-fns'
import React from 'react'
import { storybookCodeTemplate } from '../../helpers'
import { TimeRangePicker as TimeRangePickerSource } from './TimeRangePicker'

const meta: Meta<typeof TimeRangePickerSource> = {
  title: 'Components/TimeRangePicker',
  component: TimeRangePickerSource,
  tags: ['tag'],
  argTypes: {
    appearance: {
      table: {
        disable: true
      }
    }
  },
  args: { onChange: action('onChange') },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'TimeRangePicker',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof TimeRangePickerSource>

const TimeRangePicker = (args: Story['args']) => {
  return <TimeRangePickerSource {...args} />
}

const value365 = {
  value: 'last-365-days'
}
const value90 = {
  value: 'last-90-days'
}

const TimeRangePickerControlled = (args: Story['args']) => {
  const [value, setValue] = React.useState(value365)
  return (
    <div>
      <TimeRangePickerSource {...args} value={value} />
      <button
        style={{ marginTop: 10 }}
        onClick={() => {
          setValue(value === value365 ? value90 : value365)
        }}
      >
        Switch value
      </button>
    </div>
  )
}

export const DefaultStory: Story = {
  name: 'Default',
  render: (args) => <TimeRangePicker {...args} />
}

export const DefaultValueStory: Story = {
  name: 'Default value',
  args: {
    defaultValue: {
      value: 'last-365-days'
    }
  },
  render: (args) => <TimeRangePicker {...args} />
}

export const ControlledValueStory: Story = {
  name: 'Controlled value',
  args: {
    value: {
      value: 'last-365-days'
    }
  },
  render: (args) => <TimeRangePickerControlled {...args} />
}

export const CustomOptionsStory: Story = {
  name: 'Custom options',
  args: {
    options: (defaultOptions) => {
      const newOptions = defaultOptions.filter((option) => option.value === 'last-365-days')
      newOptions.push({
        value: 'yesterday',
        label: 'Yesterday',
        params: {
          start: startOfYesterday(),
          stop: endOfYesterday()
        }
      })
      return newOptions
    },
    disableCustomRelative: true
  },
  render: (args) => <TimeRangePicker {...args} />
}
