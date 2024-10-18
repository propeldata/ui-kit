import { clearContainerStyle, setContainerStyle } from './themeUtils'

describe('Theme Style Utilities', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
  })

  it('clears container style', () => {
    // Apply a style
    mockElement.style.setProperty('--propel-brand-primary', 'blue')
    clearContainerStyle(mockElement)

    const computedStyle = getComputedStyle(mockElement)
    expect(computedStyle.getPropertyValue('--propel-brand-primary')).toBe('')
  })

  it('sets container style', () => {
    const theme = {
      brandPrimary: 'red',
      foregroundBrandPrimary: 'red',
      fontSize: '12px'
    }

    setContainerStyle(mockElement, theme)

    const computedStyle = getComputedStyle(mockElement)
    expect(computedStyle.getPropertyValue('--propel-brand-primary')).toBe('red')
    expect(computedStyle.getPropertyValue('--propel-font-size')).toBe('12px')
  })
})
