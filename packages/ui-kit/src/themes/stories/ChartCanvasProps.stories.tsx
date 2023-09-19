import type { Meta, StoryObj } from '@storybook/react'
import type { ChartCanvasProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartCanvasPropsComponent: React.FC<ChartCanvasProps> = () => null
ChartCanvasPropsComponent.defaultProps = defaultStyles.canvas

const meta = {
  title: 'API/ChartCanvasProps',
  tags: ['pattern'],
  component: ChartCanvasPropsComponent
} satisfies Meta<typeof ChartCanvasPropsComponent>

export default meta
export const ChartCanvasPropsStory: StoryObj<typeof meta> = {}
