import type { Meta, StoryObj } from '@storybook/react'
import type { ChartTableHeaderProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartTableHeaderPropsComponent: React.FC<ChartTableHeaderProps> = () => null
ChartTableHeaderPropsComponent.defaultProps = defaultStyles.table?.header

const meta = {
  title: 'API/ChartTableHeaderProps',
  tags: ['pattern'],
  component: ChartTableHeaderPropsComponent
} satisfies Meta<typeof ChartTableHeaderPropsComponent>

export default meta
export const ChartTableHeaderPropsStory: StoryObj<typeof meta> = {}
