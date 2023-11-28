import { getDisplayValue } from "../../helpers"

export const getValueWithPrefixAndSufix = (params: {
  prefix?: string
  value?: string | null
  sufix?: string
  localize?: boolean
}) => {
  const { prefix, value, sufix, localize } = params

  if (value === undefined) return

  return (prefix ? prefix : '') + getDisplayValue({ value, localize }) + (sufix ? sufix : '')
}
