/**
 * Transforms an object of arguments into a string of JSX attributes.
 * - Boolean arguments are converted to a simple attribute if true, or omitted if false.
 * - Function arguments are converted to a string and cleansed of specific module import prefixes.
 * - Other arguments are JSON-stringified, and objects or arrays are wrapped with braces.
 *
 * @param {object} args - The arguments object to be transformed into a string of attributes.
 * @returns {string} A string of space-separated attributes for use in JSX.
 */

export const getStringAttributes = (args: Record<string, unknown>): string =>
  args
    ? Object.keys(args)
        .reduce((acc, item) => {
          if (typeof args[item] === 'boolean') {
            if (args[item]) {
              return acc + `${item} `
            }

            return acc
          }

          if (typeof args[item] === 'function') {
            return (
              acc + `${item}={${String(args[item]).replaceAll('_deps_exports__WEBPACK_IMPORTED_MODULE_7__.', '')}} `
            )
          }

          if (typeof args[item] === 'number') {
            return acc + `${item}="${args[item]}" `
          }

          const val = JSON.stringify(args[item])

          return acc + `${item}=${val && ['{', '['].includes(val.charAt(0)) ? `{${val}}` : val} `
        }, '')
        .trim()
    : ''
