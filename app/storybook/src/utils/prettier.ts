import type { Options } from 'prettier'
import * as prettierStandalone from 'prettier/standalone'
import prettierBabel from 'prettier/parser-babel'
import prettierCss from 'prettier/parser-postcss'

export const prettier = (input: string, options: Options = {}) =>
  prettierStandalone.format(input, {
    parser: 'babel',
    plugins: [prettierBabel, prettierCss],
    ...options
  })
