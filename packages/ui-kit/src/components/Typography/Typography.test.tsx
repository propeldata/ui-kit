import { render, screen } from '@testing-library/react'
import React, { ElementType } from 'react'
import { Typography } from './Typography'

jest.mock('./Typography.module.scss', () => ({
  rootTypography: 'rootTypography',
  textMdRegular: 'textMdRegular',
  textXxsRegular: 'textXxsRegular',
  textSmRegular: 'textSmRegular',
  block: 'block'
}))

describe('Typography', () => {
  it('renders with default props', () => {
    render(<Typography>Default Text</Typography>)

    const typography = screen.getByTestId('typography')
    expect(typography.tagName).toBe('SPAN')
    expect(typography).toHaveClass('rootTypography', 'textMdRegular')
    expect(typography).toHaveTextContent('Default Text')
  })

  it.each(['span', 'p', 'div', 'h1'])('renders as %s element when specified', (element) => {
    render(<Typography as={element as ElementType}>Text</Typography>)

    const typography = screen.getByTestId('typography')
    expect(typography.tagName).toBe(element.toUpperCase())
  })

  it.each<[variant: 'textMdRegular' | 'textXxsRegular' | 'textSmRegular', expectedClass: string]>([
    ['textMdRegular', 'textMdRegular'],
    ['textXxsRegular', 'textXxsRegular'],
    ['textSmRegular', 'textSmRegular']
  ])('applies %s variant class', (variant, expectedClass) => {
    render(<Typography variant={variant}>Text</Typography>)

    const typography = screen.getByTestId('typography')
    expect(typography).toHaveClass(expectedClass)
  })

  it('applies block class when block prop is true', () => {
    render(<Typography block>Block Text</Typography>)

    const typography = screen.getByTestId('typography')
    expect(typography).toHaveClass('block')
  })

  it('accepts and applies a custom className', () => {
    const customClassName = 'myCustomClass'

    render(<Typography className={customClassName}>Text with custom class</Typography>)

    const typography = screen.getByTestId('typography')
    expect(typography).toHaveClass(customClassName)
  })
})
