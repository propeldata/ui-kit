import { FilterOperator } from '../graphql'
import { buildOrFilter } from './buildOrFilter'

const columnName = 'some column'
const valuesToFilter = ['value_1', 'value_2', 'value_3']

describe('buildOrFilter', () => {
  it('Should build filter correctly', () => {
    const result = buildOrFilter(columnName, valuesToFilter)

    expect(result).toEqual({
      column: columnName,
      operator: FilterOperator.Equals,
      value: valuesToFilter[0],
      or: [
        {
          column: columnName,
          operator: FilterOperator.Equals,
          value: valuesToFilter[1]
        },
        {
          column: columnName,
          operator: FilterOperator.Equals,
          value: valuesToFilter[2]
        }
      ]
    })
  })
})
