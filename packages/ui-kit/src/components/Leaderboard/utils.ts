import { getDisplayValue } from '../../helpers'

interface GetTableSettingsOptions {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export function getTableSettings(options: GetTableSettingsOptions) {
  const { headers, rows } = options

  const headersWithoutValue = headers?.slice(0, headers.length - 1)
  const valueHeader = headers?.[headers.length - 1]

  const rowsWithoutValue = rows?.map((row) => row.slice(0, row.length - 1))

  const valuesByRow = rows?.map((row) => (row[row.length - 1] === null ? null : row[row.length - 1]))

  const isValidValueBar = valuesByRow?.every((value) => !isNaN(parseFloat(value ?? '')))

  const numberValuesByRow = isValidValueBar
    ? valuesByRow?.map((value) => (value === null ? null : Number(value)))
    : null
  const maxValue = isValidValueBar ? Math.max(...(numberValuesByRow || []).map((value) => value ?? -Infinity)) : null

  const isOrdered = false

  return {
    headersWithoutValue,
    valueHeader,
    valuesByRow,
    rowsWithoutValue,
    maxValue,
    isOrdered,
    numberValuesByRow,
    isValidValueBar
  }
}

export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: string | null
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (value == null) return

  return (prefix ? prefix + ' ' : '') + getDisplayValue({ value, localize }) + (sufix ? ' ' + sufix : '')
}
