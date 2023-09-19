import type { Meta, StoryObj } from '@storybook/react'
import type { ChartPointProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartPointPropsComponent: React.FC<ChartPointProps> = () => null
ChartPointPropsComponent.defaultProps = defaultStyles.point

const meta = {
  title: 'API/ChartPointProps',
  tags: ['pattern'],
  component: ChartPointPropsComponent
} satisfies Meta<typeof ChartPointPropsComponent>

export default meta
export const ChartPointPropsStory: StoryObj<typeof meta> = {}
