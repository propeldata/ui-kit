import { camelCaseToKebabCase } from './camelCaseToKebabCase'

describe('camelCaseToKebabCase', () => {
  it('converts a simple camelCase string to kebab-case', () => {
    expect(camelCaseToKebabCase('camelCase')).toBe('camel-case')
  })

  it('handles strings with multiple uppercase letters', () => {
    expect(camelCaseToKebabCase('multipleCamelCaseWords')).toBe('multiple-camel-case-words')
  })

  it('handles strings that start with an uppercase letter', () => {
    expect(camelCaseToKebabCase('CamelCaseWord')).toBe('camel-case-word')
  })

  it('leaves lowercase strings unchanged', () => {
    expect(camelCaseToKebabCase('lowercase')).toBe('lowercase')
  })

  it('handles empty strings', () => {
    expect(camelCaseToKebabCase('')).toBe('')
  })

  it('leaves kebab-case strings unchanged', () => {
    expect(camelCaseToKebabCase('already-kebab-case')).toBe('already-kebab-case')
  })
})
