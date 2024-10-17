/**
 * It receives a camelCase or snake_case name and returns a readable format
 * @example
 * prettifyName('camelCase') => 'Camel Case'
 * prettifyName('snake_case') => 'Snake Case'
 * @param name - Column name
 * @returns Prettified column name
 */
export function prettifyName(name: string | number) {
  // If the name is a number, return it as a string
  if (typeof name === 'number') {
    return name.toString()
  }

  // If the name is all uppercase, return it as is
  if (name === name.toUpperCase()) {
    return name
  }

  const camelCaseFormatted = name.replace(/([A-Z])/g, ' $1').trim()

  const snakeCaseFormatted = camelCaseFormatted.replace(/[_-]/g, ' ').trim()

  const capitalizedWords = snakeCaseFormatted
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return capitalizedWords
}
