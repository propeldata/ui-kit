interface GetDisplayValueOptions {
  value: string | null
  localize?: boolean
}

export function getDisplayValue({ value, localize }: GetDisplayValueOptions) {
  // 1. Render `null` as "-".
  if (value == null) {
    return '-'
  }

  const number = parseFloat(value)

  // 2. Handle integral numbers.
  if (Number.isInteger(number)) {
    return localize ? parseInt(value).toLocaleString() : parseInt(value)
  }

  // 3. Handle non-integral numbers.
  if (Number.isFinite(number) && !Number.isNaN(number)) {
    return localize ? parseFloat(number.toFixed(2)).toLocaleString() : number.toFixed(2)
  }

  // 4. Handle anything else.
  return value
}
