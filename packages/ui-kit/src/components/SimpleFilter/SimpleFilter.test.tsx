import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { FilterProvider } from '../FilterProvider'
import { Dom, FilterOperator, mockTopValuesQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'

import { SimpleFilter } from './SimpleFilter'

const setFilterMock = jest.fn()

jest.mock('../FilterProvider/useFilter', () => ({
  useFilter: () => ({
    filters: [],
    setFilters: setFilterMock
  })
}))

const handlers = [
  mockTopValuesQuery((req, res, ctx) => {
    const columnName = req.variables.topValuesInput.columnName

    if (columnName === 'should-fail') {
      return res(
        ctx.errors([
          {
            message: 'Something went wrong'
          }
        ])
      )
    }

    return res(
      ctx.data({
        topValues: {
          values: ['option 1', 'option 2', 'option 3']
        }
      })
    )
  })
]

describe('SimpleFilter', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should work in static mode', () => {
    dom = render(
      <FilterProvider>
        <SimpleFilter options={['option 1', 'option 2', 'option 3']} columnName="test column" />
      </FilterProvider>
    )

    fireEvent.click(dom.getByRole('button', { name: 'dropdown-button' }))
    fireEvent.click(dom.getByText('option 1'))

    expect(setFilterMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        column: 'test column',
        operator: FilterOperator.Equals,
        value: 'option 1'
      }
    ])
  })

  it('should work in connected mode', async () => {
    dom = render(
      <FilterProvider>
        <SimpleFilter
          query={{
            accessToken: 'test token',
            columnName: 'test column',
            dataPool: {
              name: 'test data pool'
            },
            maxValues: 1000,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            }
          }}
        />
      </FilterProvider>
    )

    await waitFor(() => {
      fireEvent.click(dom.getByRole('button', { name: 'dropdown-button' }))
      fireEvent.click(dom.getByText('option 1'))
    })

    expect(setFilterMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        column: 'test column',
        operator: FilterOperator.Equals,
        value: 'option 1'
      }
    ])
  })

  it('should show error icon when query fails', async () => {
    dom = render(
      <FilterProvider>
        <SimpleFilter
          query={{
            accessToken: 'test token',
            columnName: 'should-fail',
            dataPool: {
              name: 'test data pool'
            },
            maxValues: 1000,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            },
            retry: false
          }}
        />
      </FilterProvider>
    )

    await dom.findByRole('img')
  })
})
