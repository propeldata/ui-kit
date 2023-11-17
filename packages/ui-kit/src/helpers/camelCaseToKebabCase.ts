/*
 * Converts a camelCase string to kebab-case
 */

export const camelCaseToKebabCase = (str: string) =>
  str
    .split('')
    .map((char, index) => {
      if (char.toUpperCase() === char && index !== 0) {
        return '-' + char.toLowerCase()
      }
      return char
    })
    .join('')
