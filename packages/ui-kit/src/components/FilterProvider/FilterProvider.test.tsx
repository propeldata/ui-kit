import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { Dom, FilterInput, FilterOperator, mockCounterQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { FilterProvider } from './FilterProvider'
import { SimpleFilter } from '../SimpleFilter'
import { Counter } from '../Counter'

const handlers = [
  mockCounterQuery((req, res, ctx) => {
    const filters: FilterInput[] = req.variables.counterInput.filters

    if (
      filters[0].column === 'test-column' &&
      filters[0].operator === FilterOperator.Equals &&
      filters[0].value === 'option'
    ) {
      return res(ctx.data({ counter: { value: 200 } }))
    }

    return res(ctx.data({ counter: { value: 400 } }))
  })
]

describe('Filter Provider', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should provide filters to the child components', async () => {
    dom = render(
      <FilterProvider>
        <SimpleFilter options={['option']} columnName="test-column" />
        <Counter
          query={{
            accessToken: 'test token',
            metric: 'test metric',
            timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
            retry: false
          }}
        />
      </FilterProvider>
    )

    fireEvent.click(dom.getByRole('button', { name: 'dropdown-button' }))
    fireEvent.click(dom.getByText('option'))

    await dom.findByText('200')
  })
})
