import { quotedStringRegex } from './quotedStringRegex'

describe('quotedStringRegex', () => {
  it('matches the string enclosed in single quotes', () => {
    const regex = quotedStringRegex('hello')
    expect("'hello'".match(regex)).toHaveLength(1)
  })

  it('matches the string enclosed in double quotes', () => {
    const regex = quotedStringRegex('hello')
    expect('"hello"'.match(regex)).toHaveLength(1)
  })

  it('matches the string enclosed in backticks', () => {
    const regex = quotedStringRegex('hello')
    expect('`hello`'.match(regex)).toHaveLength(1)
  })

  it('does not match the string without quotes', () => {
    const regex = quotedStringRegex('hello')
    expect('hello'.match(regex)).toBeNull()
  })

  it('matches multiple occurrences of the string with different quotes', () => {
    const regex = quotedStringRegex('hello')
    const testString = '`hello`, "hello", \'hello\''
    expect(testString.match(regex)).toHaveLength(3)
  })
})
