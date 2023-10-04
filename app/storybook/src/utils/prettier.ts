import type { Options } from 'prettier'
import * as prettierStandalone from 'prettier/standalone'
import prettierBabel from 'prettier/parser-babel'

export const prettier = (input: string, options: Options = {}) =>
  prettierStandalone.format(input, {
    parser: 'babel',
    plugins: [prettierBabel],
    ...options
  })
