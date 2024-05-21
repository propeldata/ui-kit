import type { Meta, StoryObj } from '@storybook/react'
import type { PieChartQueryProps } from './PieChart.types'

export const PieChartQueryPropsComponent: React.FC<PieChartQueryProps> = () => null

const meta = {
  title: 'API/PieChartQueryProps',
  tags: ['hidden'],
  component: PieChartQueryPropsComponent
} satisfies Meta<typeof PieChartQueryPropsComponent>

PieChartQueryPropsComponent.defaultProps = {}

export default meta
export const Primary: StoryObj<typeof meta> = {}
