import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Dom, mockDataGridQuery, mockDataPoolColumnsByNameQuery, setupTestHandlers } from '../../testing'

import { DataGrid } from './DataGrid'

const handlers = [
  mockDataGridQuery((req, res, ctx) => {
    const dataPoolName = req.variables.dataGridInput.dataPool.name
    const after = req.variables.dataGridInput.after
    const first = req.variables.dataGridInput.first

    if (dataPoolName === 'should-paginate') {
      if (after === '1') {
        return res(
          ctx.data({
            dataGrid: {
              headers: ['name'],
              rows: [['page 2'], ['page 2.2']],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: true,
                startCursor: '1',
                endCursor: null
              }
            }
          })
        )
      }

      return res(
        ctx.data({
          dataGrid: {
            headers: ['name'],
            rows: [['page 1'], ['page 1.1']],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: '1'
            }
          }
        })
      )
    }

    return res(
      ctx.data({
        dataGrid: {
          headers: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id'],
          rows: [
            [
              'Breakfast',
              'El Buen Sabor',
              'Nopal',
              'dc7bd9d4-0709-4a10-a22c-976a836f1cb6',
              'e3643b7e-c287-45b2-80c3-b93c82840b46'
            ],
            [
              'Veggie',
              'El Buen Sabor',
              'Whole Wheat',
              'dc7bd9d4-0709-4a10-a22c-976a836f1cb6',
              '56b4b6f6-0c1d-4949-927a-8a0057943c6b'
            ],
            [
              'Al Pastor',
              'El Buen Sabor',
              'Spinach',
              'dc7bd9d4-0709-4a10-a22c-976a836f1cb6',
              '6c8f7f6a-25d9-4bdc-ae3b-6b92b808c1d3'
            ],
            [
              'Al Pastor',
              'El Buen Sabor',
              'Spinach',
              'dc7bd9d4-0709-4a10-a22c-976a836f1cb6',
              '6c8f7f6a-25d9-4bdc-ae3b-6b92b808c1d3'
            ],
            [
              'page size ' + first,
              'El Buen Sabor',
              'Spinach',
              'dc7bd9d4-0709-4a10-a22c-976a836f1cb6',
              '6c8f7f6a-25d9-4bdc-ae3b-6b92b808c1d3'
            ]
          ]
        }
      })
    )
  }),

  mockDataPoolColumnsByNameQuery((req, res, ctx) => {
    return res(
      ctx.data({
        dataPoolByName: {
          columns: {
            nodes: [
              { columnName: 'taco_name' },
              { columnName: 'restaurant_name' },
              { columnName: 'tortilla_name' },
              { columnName: 'restaurant_id' }
            ]
          }
        }
      })
    )
  })
]

jest.mock('@radix-ui/themes', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('DataGrid', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('renders with default values', async () => {
    dom = render(<DataGrid query={{ dataPool: { name: 'TacoSoft Demo Data' }, accessToken: 'test-token' }} />)

    await dom.findByText('Breakfast')
    await dom.findAllByText('El Buen Sabor')
    await dom.findAllByText('Al Pastor')
  }, 20000)

  it('opens the drawer when a row index is clicked', async () => {
    dom = render(<DataGrid query={{ dataPool: { name: 'TacoSoft Demo Data' }, accessToken: 'test-token' }} />)
    await dom.findByText('Breakfast')

    const index = await dom.findByText('1')
    fireEvent.click(index)

    expect(await dom.findAllByText('Breakfast')).toHaveLength(2)
  }, 10000)

  it('paginates forward and backwards', async () => {
    dom = render(
      <div style={{ height: '1000px' }}>
        <DataGrid query={{ dataPool: { name: 'should-paginate' }, accessToken: 'test-token' }} />
      </div>
    )

    await dom.findByText('page 1')

    expect(await dom.findByTestId('propel-datagrid-paginate-back')).toBeDisabled()
    fireEvent.click(await dom.findByTestId('propel-datagrid-paginate-next'))

    await dom.findByText('page 2')
    expect(dom.queryByText('page 1')).toBeNull()
    expect(await dom.findByTestId('propel-datagrid-paginate-next')).toBeDisabled()

    fireEvent.click(await dom.findByTestId('propel-datagrid-paginate-back'))
    await dom.findByText('page 1')
  }, 40000)

  it('changes page size', async () => {
    dom = render(<DataGrid query={{ dataPool: { name: 'changes-page-size' }, accessToken: 'test-token' }} />)

    await dom.findByText('10')

    fireEvent.click(await dom.findByLabelText('Rows per page:'))
    fireEvent.click(await dom.findByText('50'))

    expect(await dom.findByLabelText('Rows per page:')).toHaveTextContent('50')
  }, 40000)
})
