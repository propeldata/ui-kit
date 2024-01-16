import type { Meta, StoryObj } from '@storybook/react'
import { QueryProps } from '../shared.types'
import type { RecordsByIdQueryProps } from './RecordsById.types'

export const RecordsByIdQueryPropsComponent: React.FC<
  RecordsByIdQueryProps & Partial<Pick<QueryProps, 'accessToken' | 'refetchInterval' | 'retry' | 'propelApiUrl'>>
> = () => null

const meta = {
  title: 'API/RecordsByIdQueryProps',
  tags: ['pattern'],
  component: RecordsByIdQueryPropsComponent
} satisfies Meta<typeof RecordsByIdQueryPropsComponent>

export default meta
export const Primary: StoryObj<typeof meta> = {}
