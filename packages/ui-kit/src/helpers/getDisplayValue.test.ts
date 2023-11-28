import { getDisplayValue } from "./getDisplayValue"

describe('getDisplayValue', () => {

  beforeAll(() => {
    jest.spyOn(Number.prototype, 'toLocaleString').mockImplementation(() => 'localized')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should return "-" when value is null', () => {
    expect(getDisplayValue({ value: null })).toEqual('-')
  })

  it('should parse integers', () => {
    expect(getDisplayValue({ value: '123' })).toEqual(123)
    expect(getDisplayValue({ value: '123', localize: true })).toEqual('localized')
  })

  it('should not affect infinites', () => {
    expect(getDisplayValue({ value: '+Infinity' })).toEqual('+Infinity')
    expect(getDisplayValue({ value: '+Infinity', localize: true })).toEqual('+Infinity')

    expect(getDisplayValue({ value: '-Infinity' })).toEqual('-Infinity')
    expect(getDisplayValue({ value: '-Infinity', localize: true })).toEqual('-Infinity')
  })

  it('should not affect non-numeric values', () => {
    expect(getDisplayValue({ value: 'abc' })).toEqual('abc')
    expect(getDisplayValue({ value: true as unknown as string })).toEqual(true)
    expect(getDisplayValue({ value: false as unknown as string })).toEqual(false)
    expect(getDisplayValue({ value: {} as unknown as string })).toEqual({})
    expect(getDisplayValue({ value: [] as unknown as string })).toEqual([])
  })
})
