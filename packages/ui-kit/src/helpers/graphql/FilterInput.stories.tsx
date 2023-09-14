import type { Meta, StoryObj } from '@storybook/react'
import type { FilterInput } from './index'

export const FilterInputComponent: React.FC<FilterInput> = () => null

const meta = {
  title: 'API/FilterInput',
  tags: ['pattern'],
  component: FilterInputComponent
} satisfies Meta<typeof FilterInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const FilterInputStory: StoryObj<typeof meta> = {}
