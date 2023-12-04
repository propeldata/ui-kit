/**
 * Converts a string from camelCase to kebab-case.
 * Each uppercase letter is transformed into a lowercase letter preceded by a dash,
 * except for uppercase letters at the beginning of the string.
 *
 * @param {string} str - The camelCase string to be converted.
 * @returns {string} The kebab-case version of the input string.
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
