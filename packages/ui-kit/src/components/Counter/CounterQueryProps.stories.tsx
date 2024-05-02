import type { Meta, StoryObj } from '@storybook/react'
import type { CounterQueryProps } from './Counter.types'

export const CounterQueryPropsComponent: React.FC<CounterQueryProps> = () => null

const meta = {
  title: 'API/CounterQueryProps',
  tags: ['hidden'],
  component: CounterQueryPropsComponent
} satisfies Meta<typeof CounterQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
