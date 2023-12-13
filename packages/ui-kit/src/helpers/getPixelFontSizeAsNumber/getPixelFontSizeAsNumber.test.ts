import { getPixelFontSizeAsNumber } from './getPixelFontSizeAsNumber'

describe('getPixelFontSizeAsNumber', () => {
  let createElementSpy: jest.SpyInstance
  let appendChildSpy: jest.SpyInstance
  let removeChildSpy: jest.SpyInstance
  let getComputedStyleSpy: jest.SpyInstance

  beforeEach(() => {
    createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(
      (): HTMLElement =>
        ({
          style: {},
          appendChild: jest.fn(),
          removeChild: jest.fn(),
          textContent: ''
        } as unknown as HTMLElement)
    )

    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node: Node): Node => node)
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation((node: Node): Node => node)

    getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle').mockImplementation(
      (): CSSStyleDeclaration =>
        ({
          fontSize: '16px'
        } as CSSStyleDeclaration)
    )
  })

  afterEach(() => {
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
    getComputedStyleSpy.mockRestore()
  })

  it('converts rem to pixels correctly', () => {
    const fontSize = getPixelFontSizeAsNumber('1rem')
    expect(fontSize).toBe(16)
  })

  it('converts em to pixels correctly', () => {
    const fontSize = getPixelFontSizeAsNumber('1em')
    expect(fontSize).toBe(16)
  })

  it('handles pixel values correctly', () => {
    const fontSize = getPixelFontSizeAsNumber('16px')
    expect(fontSize).toBe(16)
  })
})
