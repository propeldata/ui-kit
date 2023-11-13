/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  modulePathIgnorePatterns: ['dist'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': '<rootDir>/src/testing/mockStyles.ts'
  },
  rootDir: '.',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', 'jest-canvas-mock'],
  testEnvironment: './jest-environment-jsdom.cjs',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  }
}

module.exports = config
