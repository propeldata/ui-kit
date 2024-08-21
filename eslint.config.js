const js = require('@eslint/js')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const storybook = require('eslint-plugin-storybook')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const prettier = require('eslint-plugin-prettier')

module.exports = [
  {
    languageOptions: {
      globals: {
        browser: true,
        es2022: true,
        node: true
      },
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react-hooks': reactHooks,
      prettier: require('eslint-plugin-prettier'),
      jest: require('eslint-plugin-jest')
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-nested-ternary': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off'
    },
    ignores: ['.idea', '.turbo', 'node_modules', 'dist', 'generated']
  }
]
