import { prettifyName } from './shared.utils'

describe('prettifyName', () => {
  it('should prettify the name if it is all uppercase', () => {
    expect(prettifyName('UPPERCASE')).toBe('Uppercase')
    expect(prettifyName('ALL_UPPERCASE_WITH_UNDERSCORE')).toBe('All Uppercase With Underscore')
  })

  it('should return the name as is if it is a number', () => {
    expect(prettifyName(123)).toBe('123')
  })

  it('should prettify the name if it is a camelCase', () => {
    expect(prettifyName('camelCase')).toBe('Camel Case')
  })

  it('should prettify the name if it is a snake_case', () => {
    expect(prettifyName('snake_case')).toBe('Snake Case')
  })
})
