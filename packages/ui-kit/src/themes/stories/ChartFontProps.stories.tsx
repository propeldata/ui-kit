import type { Meta, StoryObj } from '@storybook/react'
import type { ChartFontProps } from '../default.types'

export const ChartFontPropsComponent: React.FC<ChartFontProps> = () => null

const meta = {
  title: 'API/ChartFontProps',
  tags: ['pattern'],
  component: ChartFontPropsComponent
} satisfies Meta<typeof ChartFontPropsComponent>

export default meta
export const ChartFontPropsStory: StoryObj<typeof meta> = {}
