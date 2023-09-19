import type { Meta, StoryObj } from '@storybook/react'
import type { ChartTableProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartTablePropsComponent: React.FC<ChartTableProps> = () => null
ChartTablePropsComponent.defaultProps = defaultStyles.table

const meta = {
  title: 'API/ChartTableProps',
  tags: ['pattern'],
  component: ChartTablePropsComponent
} satisfies Meta<typeof ChartTablePropsComponent>

export default meta
export const ChartTablePropsStory: StoryObj<typeof meta> = {}
