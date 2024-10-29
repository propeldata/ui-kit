import { DataGridProps } from './DataGrid.types'
import componentStyles from './DataGrid.module.scss'

export function getDisplayValue(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch (error) {
    return value
  }
}

export function getLinesStyle(tableLinesLayout: DataGridProps['tableLinesLayout']) {
  if (tableLinesLayout == null) {
    return componentStyles.bothLines
  }

  return {
    vertical: componentStyles.verticalLines,
    horizontal: componentStyles.horizontalLines,
    both: componentStyles.bothLines,
    none: componentStyles.noLines
  }[tableLinesLayout]
}
