import type { Meta, StoryObj } from '@storybook/react'
import type { ChartYAxisProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartYAxisPropsComponent: React.FC<ChartYAxisProps> = () => null
ChartYAxisPropsComponent.defaultProps = defaultStyles.yAxis

const meta = {
  title: 'API/ChartYAxisProps',
  tags: ['pattern'],
  component: ChartYAxisPropsComponent
} satisfies Meta<typeof ChartYAxisPropsComponent>

export default meta
export const ChartYAxisPropsStory: StoryObj<typeof meta> = {}
