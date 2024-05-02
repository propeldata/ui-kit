import type { Meta, StoryObj } from '@storybook/react'
import type { TimeSeriesChartProps } from './TimeSeries.types'

export const TimeSeriesChartPropsComponent: React.FC<TimeSeriesChartProps> = () => null

const meta = {
  title: 'API/TimeSeriesChartProps',
  tags: ['hidden'],
  component: TimeSeriesChartPropsComponent
} satisfies Meta<typeof TimeSeriesChartPropsComponent>

TimeSeriesChartPropsComponent.defaultProps = {
  grid: false,
  fillArea: false
}

export default meta
export const Primary: StoryObj<typeof meta> = {}
