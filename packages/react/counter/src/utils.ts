export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: string
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (!value) return

  return (
    (prefix ? prefix + ' ' : '') +
    (localize ? parseInt(value).toFixed(2).toLocaleString() : value) +
    (sufix ? ' ' + sufix : '')
  )
}
