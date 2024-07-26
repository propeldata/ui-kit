import { kebabCaseToCamelCase } from './kebabCaseToCamelCase'

describe('kebabCaseToCamelCase', () => {
  it('converts a simple kebab-case string to camelCase', () => {
    expect(kebabCaseToCamelCase('kebab-case')).toBe('kebabCase')
  })

  it('handles strings with multiple dashes', () => {
    expect(kebabCaseToCamelCase('multiple-kebab-case-words')).toBe('multipleKebabCaseWords')
  })

  it('handles strings that start with a dash', () => {
    expect(kebabCaseToCamelCase('-kebab-case-word')).toBe('kebabCaseWord')
  })

  it('leaves lowercase strings without dashes unchanged', () => {
    expect(kebabCaseToCamelCase('lowercase')).toBe('lowercase')
  })

  it('handles empty strings', () => {
    expect(kebabCaseToCamelCase('')).toBe('')
  })

  it('leaves camelCase strings unchanged', () => {
    expect(kebabCaseToCamelCase('alreadyCamelCase')).toBe('alreadyCamelCase')
  })

  it('handles strings with numbers', () => {
    expect(kebabCaseToCamelCase('kebab-case-123')).toBe('kebabCase123')
  })

  it('handles strings with consecutive dashes', () => {
    expect(kebabCaseToCamelCase('kebab--case')).toBe('kebabCase')
  })
})
