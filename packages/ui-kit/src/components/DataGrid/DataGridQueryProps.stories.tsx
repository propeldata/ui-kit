import type { Meta, StoryObj } from '@storybook/react'
import { QueryProps } from '../shared.types'
import type { DataGridQueryProps } from './DataGrid.types'

export const DataGridQueryPropsComponent: React.FC<DataGridQueryProps & Omit<QueryProps, 'metric'>> = () => null

const meta = {
  title: 'API/DataGridQueryProps',
  tags: ['hidden'],
  component: DataGridQueryPropsComponent
} satisfies Meta<typeof DataGridQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
