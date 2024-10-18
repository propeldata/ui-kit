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
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2') // Insert dash between lower case letters and upper case letters or digits
    .replace(/^-/, '') // Remove leading dash if present
    .toLowerCase() // Convert to lower case
