/**
 * Converts a string from kebab-case to camelCase.
 * Each dash followed by a letter is transformed by removing the dash and capitalizing the letter,
 * except for the first character of the string which remains lowercase.
 * Consecutive dashes are treated as a single dash.
 *
 * @param {string} str - The kebab-case string to be converted.
 * @returns {string} The camelCase version of the input string.
 */
export const kebabCaseToCamelCase = (str: string) =>
  str
    .replace(/-+([a-z0-9])/g, (_, char) => char.toUpperCase()) // Replace one or more dashes + lowercase letter/digit with uppercase letter/digit
    .replace(/^-+/, '') // Remove leading dashes if present
    .replace(/^([A-Z])/, (firstChar) => firstChar.toLowerCase()) // Ensure the first character is lowercase
