import type { Meta, StoryObj } from '@storybook/react'
import type { ChartTableValueBarProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartTableValueBarPropsComponent: React.FC<ChartTableValueBarProps> = () => null
ChartTableValueBarPropsComponent.defaultProps = defaultStyles.table?.valueBar

const meta = {
  title: 'API/ChartTableValueBarProps',
  tags: ['pattern'],
  component: ChartTableValueBarPropsComponent
} satisfies Meta<typeof ChartTableValueBarPropsComponent>

export default meta
export const ChartTableValueBarPropsStory: StoryObj<typeof meta> = {}
