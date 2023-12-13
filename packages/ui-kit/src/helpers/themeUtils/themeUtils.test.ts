import { parseComputedStyle, clearContainerStyle, setContainerStyle } from './themeUtils'

describe('Theme Style Utilities', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
  })

  it('parses computed style correctly', () => {
    // Apply some sample styles to mockElement
    mockElement.style.setProperty('--propel-color-primary', 'blue')
    mockElement.style.setProperty('--propel-font-size', '16px')

    const parsedStyle = parseComputedStyle(mockElement)
    expect(parsedStyle.colorPrimary).toBe('blue')
    expect(parsedStyle.fontSize).toBe('16px')
  })

  it('clears container style', () => {
    // Apply a style
    mockElement.style.setProperty('--propel-color-primary', 'blue')
    clearContainerStyle(mockElement)

    const computedStyle = getComputedStyle(mockElement)
    expect(computedStyle.getPropertyValue('--propel-color-primary')).toBe('')
  })

  it('sets container style', () => {
    const theme = {
      colorPrimary: 'red',
      fontSize: '12px'
    }

    setContainerStyle(mockElement, theme)

    const computedStyle = getComputedStyle(mockElement)
    expect(computedStyle.getPropertyValue('--propel-color-primary')).toBe('red')
    expect(computedStyle.getPropertyValue('--propel-font-size')).toBe('12px')
  })
})
