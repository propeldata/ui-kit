import { DimensionInput } from '@/graphql/generated'

export function buildDimensionsInput(
  dimensions: DimensionInput[],
  groupBy: string[],
  emptyGroupBy: string[]
): DimensionInput[] | undefined {
  if (dimensions.length > 0 || groupBy.length > 0 || emptyGroupBy.length > 0) {
    if (dimensions.length > 0) {
      return dimensions
    }

    if (groupBy.length > 0) {
      return groupBy.map((groupName) => ({ columnName: groupName }))
    }

    if (emptyGroupBy.length > 0) {
      return emptyGroupBy.map((groupName) => ({ columnName: groupName }))
    }
  }
  return undefined
}
