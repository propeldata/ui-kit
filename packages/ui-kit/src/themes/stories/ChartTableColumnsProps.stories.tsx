import type { Meta, StoryObj } from '@storybook/react'
import type { ChartTableColumnsProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartTableColumnsPropsComponent: React.FC<ChartTableColumnsProps> = () => null
ChartTableColumnsPropsComponent.defaultProps = defaultStyles.table?.columns

const meta = {
  title: 'API/ChartTableColumnsProps',
  tags: ['pattern'],
  component: ChartTableColumnsPropsComponent
} satisfies Meta<typeof ChartTableColumnsPropsComponent>

export default meta
export const ChartTableColumnsPropsStory: StoryObj<typeof meta> = {}
