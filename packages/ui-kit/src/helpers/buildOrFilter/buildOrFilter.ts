import { FilterInput, FilterOperator } from '../graphql'

/**
 * Takes a columnName and an array of values and returns an OR filter list
 * @param columnName The name of the column to which the filter will be applied
 * @param valueList The list of values to be filtered
 */
export function buildOrFilter(columnName: string, value: string[]): FilterInput {
  const valueList = [...value]

  const OrFilters: FilterInput[] = []

  const filter: FilterInput = {
    column: columnName,
    operator: FilterOperator.Equals,
    value: valueList[0]
  }

  valueList.shift()

  valueList.forEach((value) => {
    OrFilters.push({ column: columnName, operator: FilterOperator.Equals, value })
  })

  filter.or = OrFilters

  return filter
}
