import { render, screen } from '@testing-library/react'
import React from 'react'
import { Divider } from './Divider'

jest.mock('./Divider.module.scss', () => ({
  rootDivider: 'rootDivider'
}))

describe('Divider', () => {
  it('renders as an `hr` by default', () => {
    render(<Divider />)

    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveClass('rootDivider')
    expect(divider.tagName).toBe('HR')
  })

  it('renders as the specified element using `as` prop', () => {
    render(<Divider as="div" />)

    const divider = screen.getByRole('separator')
    expect(divider.tagName).toBe('DIV')
  })

  it('accepts and applies additional class names', () => {
    const additionalClass = 'my-custom-class'

    render(<Divider className={additionalClass} />)

    const divider = screen.getByRole('separator')
    expect(divider).toHaveClass('rootDivider', additionalClass)
  })
})
