import type { Meta, StoryObj } from '@storybook/react'
import type { TimeSeriesQueryProps } from './TimeSeries.types'

export const TimeSeriesQueryPropsComponent: React.FC<TimeSeriesQueryProps> = () => null

const meta = {
  title: 'API/TimeSeriesQueryProps',
  tags: ['hidden'],
  component: TimeSeriesQueryPropsComponent
} satisfies Meta<typeof TimeSeriesQueryPropsComponent>

// @TODO: assign the value for timestampFormat from a real object
TimeSeriesQueryPropsComponent.defaultProps = {
  timestampFormat: 'MM/dd'
}

export default meta
export const Primary: StoryObj<typeof meta> = {}
