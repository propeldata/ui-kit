/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  rootDir: '.',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '@/testing/(.*)': '<rootDir>/testing/$1',
    '@/testing': '<rootDir>/testing',
    '@/time-series/(.*)': '<rootDir>/src/(.*)',
    '@/time-series': '<rootDir>/src'
  },
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