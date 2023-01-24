export const getValueWithPrefixAndSufix = (params: { prefix?: string; value: string; sufix?: string }) => {
  const { prefix, value, sufix } = params

  return (prefix ? prefix + ' ' : '') + value + (sufix ? ' ' + sufix : '')
}
