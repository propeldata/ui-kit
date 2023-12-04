/**
 * Creates a regular expression to match a given string enclosed in quotes.
 * The function supports matching the string with backticks (`), single quotes ('), and double quotes (").
 * This is particularly useful for scenarios where the type of quote used is variable or unknown.
 *
 * @param {string} input - The string to be enclosed in quotes in the regex pattern.
 * @returns {RegExp} A regular expression that matches the input string enclosed in any of the supported quote types.
 */
export const quotedStringRegex = (input: string) => new RegExp(`[\`"']${input}[\`"']`, 'g')
