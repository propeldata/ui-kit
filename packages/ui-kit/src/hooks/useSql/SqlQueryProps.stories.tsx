import type { Meta, StoryObj } from '@storybook/react'
import { QueryProps } from '../../components/shared.types'
import type { SqlQueryProps } from './Sql.types'

export const SqlQueryPropsComponent: React.FC<
  SqlQueryProps & Omit<QueryProps, 'timeZone' | 'timeRange' | 'metric' | 'filters'>
> = () => null

const meta = {
  title: 'API/SqlQueryProps',
  tags: ['pattern'],
  component: SqlQueryPropsComponent
} satisfies Meta<typeof SqlQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
