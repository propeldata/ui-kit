import type { Meta, StoryObj } from '@storybook/react'
import type { ChartPaddingOptions } from '../default.types'

export const ChartPaddingOptionsComponent: React.FC<ChartPaddingOptions> = () => null

const meta = {
  title: 'API/ChartPaddingOptions',
  tags: ['pattern'],
  component: ChartPaddingOptionsComponent
} satisfies Meta<typeof ChartPaddingOptionsComponent>

export default meta
export const ChartPaddingOptionsStory: StoryObj<typeof meta> = {}
