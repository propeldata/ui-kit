export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value: string
  sufix?: string
  locale?: boolean
}) => {
  const { prefix, value, sufix, locale } = params

  return (prefix ? prefix + ' ' : '') + (locale ? parseInt(value).toLocaleString() : value) + (sufix ? ' ' + sufix : '')
}
