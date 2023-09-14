import type { Meta, StoryObj } from '@storybook/react'
import type { ChartTooltipProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartTooltipPropsComponent: React.FC<ChartTooltipProps> = () => null
ChartTooltipPropsComponent.defaultProps = defaultStyles.tooltip

const meta = {
  title: 'API/ChartTooltipProps',
  tags: ['pattern'],
  component: ChartTooltipPropsComponent
} satisfies Meta<typeof ChartTooltipPropsComponent>

export default meta
export const ChartTooltipPropsStory: StoryObj<typeof meta> = {}
