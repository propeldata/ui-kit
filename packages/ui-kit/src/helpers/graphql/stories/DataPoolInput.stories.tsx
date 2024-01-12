import type { Meta, StoryObj } from '@storybook/react'
import type { DataPoolInput } from '../index'

export const DataPoolInputComponent: React.FC<DataPoolInput> = () => null

const meta = {
  title: 'API/DataPoolInput',
  tags: ['pattern'],
  component: DataPoolInputComponent,
  argTypes: {
    id: {
      control: 'text',
      description: 'The id of the data pool to use for the metric. Required if `name` is not provided.'
    },
    name: {
      control: 'text',
      description: 'The name of the data pool to use for the metric. Required if `id` is not provided.'
    }
  }
} satisfies Meta<typeof DataPoolInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DataPoolInputStory: StoryObj<typeof meta> = {}
