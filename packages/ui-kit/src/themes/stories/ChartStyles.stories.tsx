import type { Meta, StoryObj } from '@storybook/react'
import type { ChartStyles } from '../default.types'

export const ChartStylesComponent: React.FC<ChartStyles> = () => null

const meta = {
  title: 'API/ChartStyles',
  tags: ['pattern'],
  component: ChartStylesComponent
} satisfies Meta<typeof ChartStylesComponent>

export default meta
export const ChartStylesStory: StoryObj<typeof meta> = {}
