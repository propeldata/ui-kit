/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  modulePathIgnorePatterns: ['dist'],
  rootDir: '.',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '@/testing/(.*)': '<rootDir>/testing/$1',
    '@/testing': '<rootDir>/testing',
    '@/leaderboard/(.*)': '<rootDir>/src/(.*)',
    '@/leaderboard': '<rootDir>/src'
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
