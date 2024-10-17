export function getGroupByLabel(selectedColumns: string[]) {
  if (selectedColumns.length === 0) {
    return 'Ungrouped'
  }

  if (selectedColumns.length === 1) {
    return selectedColumns[0]
  }

  return selectedColumns.length
}

export function buildFormatter(nameFormatter?: (name: string) => string) {
  return function (name: string | number) {
    if (typeof name === 'number') {
      return name.toString()
    }

    if (nameFormatter == null) {
      return name
    }

    return nameFormatter(name)
  }
}
