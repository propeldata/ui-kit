import type { Meta, StoryObj } from '@storybook/react'
import type { MultiSelectFilterQueryProps } from './MultiSelectFilter.types'

export const MultiSelectFilterQueryPropsComponent: React.FC<MultiSelectFilterQueryProps> = () => null

const meta = {
  title: 'API/MultiSelectFilterQueryProps',
  tags: ['pattern'],
  component: MultiSelectFilterQueryPropsComponent
} satisfies Meta<typeof MultiSelectFilterQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
