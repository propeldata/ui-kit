// import { clearContainerStyle, setContainerStyle } from './themeUtils'
import { setContainerStyle } from './themeUtils'

describe('Theme Style Utilities', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
  })

  // @TODO: Fix this test
  // it('clears container style', () => {
  //   // Apply a style
  //   mockElement.style.setProperty('--brand-primary', 'blue')
  //   clearContainerStyle(mockElement)

  //   const computedStyle = getComputedStyle(mockElement)
  //   expect(computedStyle.getPropertyValue('--brand-primary')).toBe('')
  // })

  it('sets container style', () => {
    const theme = {
      brandPrimary: 'red',
      foregroundBrandPrimary: 'red',
      fontSize: '12px'
    }

    setContainerStyle(mockElement, theme)

    const computedStyle = getComputedStyle(mockElement)
    expect(computedStyle.getPropertyValue('--brand-primary')).toBe('red')
    expect(computedStyle.getPropertyValue('--font-size')).toBe('12px')
  })
})
