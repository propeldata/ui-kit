import type { Meta, StoryObj } from '@storybook/react'
import { QueryProps } from '../shared.types'
import type { TopValuesQueryProps } from './TopValues.types'

export const TopValuesQueryPropsComponent: React.FC<TopValuesQueryProps & Omit<QueryProps, 'filters'>> = () => null

const meta = {
  title: 'API/TopValuesQueryProps',
  tags: ['hidden'],
  component: TopValuesQueryPropsComponent
} satisfies Meta<typeof TopValuesQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
