import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Dom, mockSqlQuery, setupTestHandlers } from '../../testing'
import { SqlQueryProps } from './Sql.types'
import { useSql } from './useSql'

const mockData = {
  columns: [{ columnName: 'column-1' }, { columnName: 'column-2' }],
  rows: [
    ['id-1', 'record-1'],
    ['id-2', 'record-2']
  ]
}

const handlers = [
  mockSqlQuery((req, res, ctx) => {
    return res(
      ctx.data({
        sqlV1: mockData
      })
    )
  })
]

const mockQuery = {
  accessToken: 'token',
  query: `select * from "table_name" limit 5`
}

describe('useSql', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useSQL hook
  const CustomComponent = (props: SqlQueryProps) => {
    const { data } = useSql(props)
    return (
      <table>
        <thead>
          <tr>
            {data?.sqlV1?.columns?.map((col, index) => (
              <th key={index}>{col?.columnName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.sqlV1?.rows?.map((row, index) => (
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
  const QuerClientProviderComponent = (props: SqlQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useSql return value', async () => {
    dom = render(<QuerClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.columns[0]?.columnName)
    await dom.findByText(mockData.rows[0][1])
  })
})
