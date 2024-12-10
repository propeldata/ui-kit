import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { FilterProvider } from '../FilterProvider'
import { Dom, mockTopValuesQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'

import { SimpleFilter } from './SimpleFilter'

const setFilterMock = jest.fn()
const setFilterSqlListMock = jest.fn()

jest.mock('../FilterProvider/useFilters', () => ({
  useFilters: () => ({
    filters: [],
    setFilters: setFilterMock,
    filterSqlList: [],
    setFilterSqlList: setFilterSqlListMock
  })
}))

const handlers = [
  mockTopValuesQuery((req, res, ctx) => {
    const { columnName, timeZone } = req.variables.topValuesInput

    if (columnName === 'test-time-zone') {
      return res(
        ctx.data({
          topValues: {
            values: [timeZone]
          }
        })
      )
    }

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

    expect(setFilterSqlListMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        filterSql: `"test column" = 'option 1'`
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

    expect(setFilterSqlListMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        filterSql: `"test column" = 'option 1'`
      }
    ])
  })

  it('Should pass query.timeZone to the query', async () => {
    dom = render(
      <FilterProvider>
        <SimpleFilter
          query={{
            accessToken: 'test token',
            columnName: 'test-time-zone',
            dataPool: {
              name: 'test data pool'
            },
            maxValues: 1000,
            timeZone: 'Europe/Berlin',
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
      fireEvent.click(dom.getByText('Europe/Berlin'))
    })

    expect(setFilterSqlListMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        filterSql: `"test-time-zone" = 'Europe/Berlin'`
      }
    ])
  })

  it('should build labeled filters correctly', async () => {
    dom = render(
      <FilterProvider>
        <SimpleFilter columnName="test column" options={[{ label: 'Option 1', value: 'option_1' }]} />
      </FilterProvider>
    )

    await waitFor(() => {
      fireEvent.click(dom.getByRole('button', { name: 'dropdown-button' }))
      fireEvent.click(dom.getByText('Option 1'))
    })

    expect(setFilterSqlListMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        filterSql: `"test column" = 'option_1'`
      }
    ])
  })
})
