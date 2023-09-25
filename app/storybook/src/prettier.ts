import * as prettierStandalone from 'prettier/standalone'
import prettierBabel from 'prettier/parser-babel'

export const prettier = (input: string) =>
  prettierStandalone.format(input, {
    parser: 'babel',
    plugins: [prettierBabel]
  })
