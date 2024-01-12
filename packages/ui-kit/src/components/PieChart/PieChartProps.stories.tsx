import type { Meta, StoryObj } from '@storybook/react'
import type { ChartProps } from './PieChart.types'

export const PieChartPropsComponent: React.FC<ChartProps> = () => null

const meta = {
  title: 'API/PieChartProps',
  tags: ['pattern'],
  component: PieChartPropsComponent
} satisfies Meta<typeof PieChartPropsComponent>

PieChartPropsComponent.defaultProps = {
  labelPosition: 'axis',
  chartColorPalette: [
    '#1849A9',
    '#175CD3',
    '#1570EF',
    '#2E90FA',
    '#53B1FD',
    '#84CAFF',
    '#B2DDFF',
    '#D1E9FF',
    '#EFF8FF',
    '#EFF8FF'
  ]
}

export default meta
export const Primary: StoryObj<typeof meta> = {}
