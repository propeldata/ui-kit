import type { Meta, StoryObj } from '@storybook/react'
import type { DimensionInput } from '../index'

export const DimensionInputComponent: React.FC<DimensionInput> = () => null

const meta = {
  title: 'API/DimensionInput',
  tags: ['hidden'],
  component: DimensionInputComponent
} satisfies Meta<typeof DimensionInputComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DimensionInputStory: StoryObj<typeof meta> = {}
