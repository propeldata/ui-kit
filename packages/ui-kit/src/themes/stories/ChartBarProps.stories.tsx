import type { Meta, StoryObj } from '@storybook/react'
import type { ChartBarProps } from '../default.types'
import { defaultStyles } from '../defaultStyles'

export const ChartBarPropsComponent: React.FC<ChartBarProps> = () => null
ChartBarPropsComponent.defaultProps = defaultStyles.bar

const meta = {
  title: 'API/ChartBarProps',
  tags: ['pattern'],
  component: ChartBarPropsComponent
} satisfies Meta<typeof ChartBarPropsComponent>

export default meta
export const ChartBarPropsStory: StoryObj<typeof meta> = {}
