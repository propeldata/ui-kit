import type { Meta, StoryObj } from '@storybook/react'
import type { ChartLineProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartLinePropsComponent: React.FC<ChartLineProps> = () => null
ChartLinePropsComponent.defaultProps = defaultStyles.line

const meta = {
  title: 'API/ChartLineProps',
  tags: ['pattern'],
  component: ChartLinePropsComponent
} satisfies Meta<typeof ChartLinePropsComponent>

export default meta
export const ChartLinePropsStory: StoryObj<typeof meta> = {}
