import type { Options } from 'prettier'
import * as prettierStandalone from 'prettier/standalone'
import prettierBabel from 'prettier/parser-babel'
import prettierCss from 'prettier/parser-postcss'

/**
 * Formats a given input string using Prettier with support for Babel and PostCSS syntax.
 * The function allows custom Prettier options to be specified while providing sensible defaults.
 * By default, it uses the 'babel' parser which is suitable for JavaScript or JSX content
 * and includes plugins for handling Babel and CSS parsing.
 *
 * @param {string} input - The code or content to be formatted.
 * @param {Options} options - Optional Prettier configuration overrides.
 * @returns {string} The formatted result as a string.
 */

export const prettier = (input: string, options: Options = {}) =>
  prettierStandalone.format(input, {
    parser: 'babel',
    plugins: [prettierBabel, prettierCss],
    ...options
  })
