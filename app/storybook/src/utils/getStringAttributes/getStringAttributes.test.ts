import { getStringAttributes } from './getStringAttributes'

describe('getStringAttributes', () => {
  it('should handle boolean values correctly', () => {
    expect(getStringAttributes({ visible: true, hidden: false })).toBe('visible')
  })

  it('should handle function values correctly', () => {
    const attrString = getStringAttributes({ onClick: () => {} })
    expect(attrString).toContain('onClick={')
    expect(attrString).not.toContain('_deps_exports__WEBPACK_IMPORTED_MODULE_7__.')
  })

  it('should handle object values correctly', () => {
    expect(getStringAttributes({ style: { color: 'red', fontSize: 12 } })).toBe('style={{"color":"red","fontSize":12}}')
  })

  it('should handle array values correctly', () => {
    expect(getStringAttributes({ items: ['item1', 'item2'] })).toBe('items={["item1","item2"]}')
  })

  it('should handle string values correctly', () => {
    expect(getStringAttributes({ label: 'Submit' })).toBe('label="Submit"')
  })

  it('should handle number values correctly', () => {
    expect(getStringAttributes({ count: 5 })).toBe('count="5"')
  })
})
