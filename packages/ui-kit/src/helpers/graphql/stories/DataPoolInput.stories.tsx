import type { Meta, StoryObj } from '@storybook/react'
import type { DataPoolInput } from '../index'

export const DataPoolInputComponent: React.FC<DataPoolInput> = () => null

const meta = {
  title: 'API/DataPoolInput',
  tags: ['pattern'],
  component: DataPoolInputComponent
} satisfies Meta<typeof DataPoolInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DataPoolInputStory: StoryObj<typeof meta> = {}
