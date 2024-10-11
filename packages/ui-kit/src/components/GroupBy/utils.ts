export function getGroupByLabel(selectedColumns: string[]) {
  if (selectedColumns.length === 0) {
    return 'Ungrouped'
  }

  if (selectedColumns.length === 1) {
    return selectedColumns[0]
  }

  return selectedColumns.length
}
