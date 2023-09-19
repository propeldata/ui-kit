import type { Meta, StoryObj } from '@storybook/react'
import type { ChartTableValueColumnProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartTableValueColumnPropsComponent: React.FC<ChartTableValueColumnProps> = () => null
ChartTableValueColumnPropsComponent.defaultProps = defaultStyles.table?.valueColumn

const meta = {
  title: 'API/ChartTableValueColumnProps',
  tags: ['pattern'],
  component: ChartTableValueColumnPropsComponent
} satisfies Meta<typeof ChartTableValueColumnPropsComponent>

export default meta
export const ChartTableValueColumnPropsStory: StoryObj<typeof meta> = {}
