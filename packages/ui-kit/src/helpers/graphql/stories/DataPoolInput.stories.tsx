import type { Meta, StoryObj } from '@storybook/react'
import type { DataPoolInput } from '../index'

export const DataPoolInputComponent: React.FC<DataPoolInput> = () => null

const meta = {
  title: 'API/DataPoolInput',
  tags: ['pattern'],
  component: DataPoolInputComponent,
  argTypes: {
    id: {
      description: 'The ID of the Data Pool to query. Required if `name` is not provided.'
    },
    name: {
      description: 'The name of the Data Pool to query. Required if `id` is not provided.'
    }
  }
} satisfies Meta<typeof DataPoolInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DataPoolInputStory: StoryObj<typeof meta> = {}
