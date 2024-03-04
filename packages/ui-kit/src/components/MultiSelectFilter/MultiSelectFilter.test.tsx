import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { FilterProvider } from '../FilterProvider'
import { Dom, FilterOperator, mockTopValuesQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'

import { MultiSelectFilter } from './MultiSelectFilter'

const setFilterMock = jest.fn()

jest.mock('../FilterProvider/useFilters', () => ({
  useFilters: () => ({
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

describe('MultiSelectFilter', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should work in static mode', () => {
    dom = render(
      <FilterProvider>
        <MultiSelectFilter options={['option 1', 'option 2', 'option 3']} columnName="test column" />
      </FilterProvider>
    )

    fireEvent.click(dom.getByRole('button'))
    fireEvent.click(dom.getByText('option 1'))
    fireEvent.click(dom.getByText('option 2'))

    expect(setFilterMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        column: 'test column',
        operator: FilterOperator.Equals,
        value: 'option 1',
        or: [
          {
            column: 'test column',
            operator: FilterOperator.Equals,
            value: 'option 2'
          }
        ]
      }
    ])
  })

  it('should work in connected mode', async () => {
    dom = render(
      <FilterProvider>
        <MultiSelectFilter
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
      fireEvent.click(dom.getByRole('button'))
      fireEvent.click(dom.getByText('option 1'))
      fireEvent.click(dom.getByText('option 2'))
    })

    expect(setFilterMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        column: 'test column',
        operator: FilterOperator.Equals,
        value: 'option 1',
        or: [
          {
            column: 'test column',
            operator: FilterOperator.Equals,
            value: 'option 2'
          }
        ]
      }
    ])
  })

  it('should build labeled filters correctly', async () => {
    dom = render(
      <FilterProvider>
        <MultiSelectFilter
          columnName="test column"
          options={[
            { label: 'Option 1', value: 'option_1' },
            { label: 'Option 2', value: 'option_2' }
          ]}
        />
      </FilterProvider>
    )

    fireEvent.click(dom.getByRole('button'))
    fireEvent.click(await dom.findByText('Option 1'))
    fireEvent.click(await dom.findByText('Option 2'))

    expect(setFilterMock).toHaveBeenCalledWith([
      {
        id: expect.any(Symbol),
        column: 'test column',
        operator: FilterOperator.Equals,
        value: 'option_1',
        or: [
          {
            column: 'test column',
            operator: FilterOperator.Equals,
            value: 'option_2'
          }
        ]
      }
    ])
  })
})
