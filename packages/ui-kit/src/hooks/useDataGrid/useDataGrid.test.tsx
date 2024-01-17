import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Dom, mockDataGridQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { DataGridQueryProps } from '../../components'
import { useDataGrid } from './useDataGrid'

const mockData = {
  headers: ['header-1', 'header-2', 'header-3'],
  rows: [
    ['row-1 cols-1', 'row-1 cols-2', 'row-1 cols-3'],
    ['row-2 cols-1', 'row-2 cols-2', 'row-2 cols-3']
  ]
}

const handlers = [
  mockDataGridQuery((req, res, ctx) => {
    return res(
      ctx.data({
        dataGrid: mockData
      })
    )
  })
]

const mockQuery = {
  accessToken: 'token',
  dataPool: {
    name: 'data-pool'
  },
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  }
}

describe('useDataGrid', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useDataGrid hook
  const CustomComponent = (props: DataGridQueryProps) => {
    const { data } = useDataGrid(props)
    return (
      <table>
        <thead>
          <tr>
            {data?.dataGrid?.headers?.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.dataGrid?.rows?.map((row, index) => (
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
  const QuerClientProviderComponent = (props: DataGridQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useDataGrid return value', async () => {
    dom = render(<QuerClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.headers[0])
    await dom.findByText(mockData.rows[0][1])
  })
})
