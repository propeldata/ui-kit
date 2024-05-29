import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../graphql'
import { Dom, mockRecordsByUniqueIdQuery, setupTestHandlers } from '../../testing'
import { RecordsByIdQueryProps } from '../../components'
import { useRecordsById } from './useRecordsById'

const mockData = {
  columns: ['column-1', 'column-2'],
  values: [
    ['unique-id-1', 'record-1'],
    ['unique-id-1', 'rrcord-2']
  ]
}

const handlers = [
  mockRecordsByUniqueIdQuery((req, res, ctx) => {
    return res(
      ctx.data({
        recordsByUniqueId: mockData
      })
    )
  })
]

const mockQuery = {
  accessToken: 'token',
  dataPool: { id: 'data-pool-id' },
  columns: ['column-1', 'column-2'],
  uniqueIds: ['unique-id-1', 'unique-id-2']
}

describe('useRecordsById', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useRecordsById hook
  const CustomComponent = (props: RecordsByIdQueryProps) => {
    const { data } = useRecordsById(props)
    return (
      <table>
        <thead>
          <tr>
            {data?.recordsByUniqueId?.columns?.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.recordsByUniqueId?.values?.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Setup QueryClientProvider for react-query
  const QueryClientProviderComponent = (props: RecordsByIdQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useRecordsById return value', async () => {
    dom = render(<QueryClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.columns[0])
    await dom.findByText(mockData.values[0][1])
  })
})
