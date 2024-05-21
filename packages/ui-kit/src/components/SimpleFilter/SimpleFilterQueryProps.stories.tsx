import type { Meta, StoryObj } from '@storybook/react'
import type { SimpleFilterQueryProps } from './SimpleFilter.types'

export const SimpleFilterQueryPropsComponent: React.FC<SimpleFilterQueryProps> = () => null

const meta = {
  title: 'API/SimpleFilterQueryProps',
  tags: ['hidden'],
  component: SimpleFilterQueryPropsComponent
} satisfies Meta<typeof SimpleFilterQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
