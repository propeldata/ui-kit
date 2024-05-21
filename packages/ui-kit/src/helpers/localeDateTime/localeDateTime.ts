export const getLocale = () => new Intl.NumberFormat().resolvedOptions().locale

export const is12HourFormat = (locale?: string) =>
  Intl.DateTimeFormat(locale ?? getLocale(), { hour: 'numeric' }).resolvedOptions().hour12

type GetDateTimeFormatPatternProps = {
  locale?: string
  options?: Intl.DateTimeFormatOptions
}

export const getDateTimeFormatPattern = ({ locale: localeProp, options }: GetDateTimeFormatPatternProps) => {
  const locale = localeProp ?? getLocale()
  return new Intl.DateTimeFormat(locale, options)
    .formatToParts()
    .map((part) => {
      switch (part.type) {
        case 'year':
          return 'yyyy'
        case 'month':
          return options?.month === 'long' ? 'MMM' : 'MM'
        case 'day':
          return 'dd'
        case 'hour':
          return is12HourFormat(locale) ? 'hh' : 'HH'
        case 'minute':
          return 'mm'
        case 'second':
          return 'ss'
        case 'dayPeriod':
          return is12HourFormat(locale) ? 'a' : ''
        case 'literal':
          // Replace non-breaking space with regular space
          return part.value.charCodeAt(0) === 8239 ? ' ' : part.value
        default:
          return part.type
      }
    })
    .join('')
}
