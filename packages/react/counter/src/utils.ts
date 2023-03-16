interface getValueOptions {
  value: string
  localize?: boolean
}

const getValue = (options: getValueOptions) => {
  const { value, localize } = options

  const isInteger = Number.isInteger(parseFloat(value))

  if (isInteger) {
    return localize ? parseInt(value).toLocaleString() : parseInt(value)
  }

  return localize
    ? parseFloat(parseFloat(value).toFixed(2).toLocaleString()).toLocaleString()
    : parseFloat(value).toFixed(2)
}

export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: string
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (!value) return

  return (prefix ? prefix : '') + getValue({ value, localize }) + (sufix ? sufix : '')
}
