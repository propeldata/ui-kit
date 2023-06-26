interface getValueOptions {
  value: string | null
  localize?: boolean
}

const getValue = (options: getValueOptions) => {
  const { value, localize } = options

  if (value !== null && Number.isInteger(parseFloat(value))) {
    return localize ? parseInt(value).toLocaleString() : parseInt(value)
  }
  if (value === null) {
    return '-'
  }

  return localize
    ? parseFloat(parseFloat(value).toFixed(2).toLocaleString()).toLocaleString()
    : parseFloat(value).toFixed(2)
}

export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: string | null
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (value === undefined) return

  return (prefix ? prefix : '') + getValue({ value, localize }) + (sufix ? sufix : '')
}
