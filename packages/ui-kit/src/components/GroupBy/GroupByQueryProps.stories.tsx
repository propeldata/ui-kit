import type { Meta, StoryObj } from '@storybook/react'
import type { GroupByQueryProps } from './GroupBy.types'

export const GroupByQueryPropsComponent: React.FC<GroupByQueryProps> = () => null

const meta = {
  title: 'API/GroupByQueryProps',
  tags: ['hidden'],
  component: GroupByQueryPropsComponent
} satisfies Meta<typeof GroupByQueryPropsComponent>

GroupByQueryPropsComponent.defaultProps = {}

export default meta
export const Primary: StoryObj<typeof meta> = {}
