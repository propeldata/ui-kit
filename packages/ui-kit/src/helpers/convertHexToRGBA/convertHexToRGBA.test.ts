import { convertHexToRGBA } from './convertHexToRGBA'

describe('convertHexToRGBA', () => {
  it('converts 6-digit HEX codes to RGBA', () => {
    expect(convertHexToRGBA('#1E90FF', 1)).toBe('rgba(30,144,255,1)')
  })

  it('converts 3-digit HEX codes to RGBA', () => {
    expect(convertHexToRGBA('#1E9', 1)).toBe('rgba(17,238,153,1)')
  })

  it('handles opacity values from 0 to 1', () => {
    expect(convertHexToRGBA('#1E90FF', 0.5)).toBe('rgba(30,144,255,0.5)')
  })

  it('handles opacity values from 0 to 100', () => {
    expect(convertHexToRGBA('#1E90FF', 50)).toBe('rgba(30,144,255,0.5)')
  })

  it('defaults opacity to 1 if not provided', () => {
    expect(convertHexToRGBA('#1E90FF')).toBe('rgba(30,144,255,1)')
  })

  it('throws an error if no HEX code is provided', () => {
    expect(() => convertHexToRGBA()).toThrow('A HEX color code is required.')
  })

  it('throws an error for invalid HEX codes', () => {
    expect(() => convertHexToRGBA('invalidHex')).toThrow()
  })
})
