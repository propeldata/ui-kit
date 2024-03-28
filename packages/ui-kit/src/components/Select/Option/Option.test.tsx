import { render, screen } from '@testing-library/react'
import React from 'react'
import { Option } from './Option'

jest.mock('./Option.module.scss', () => ({
  rootOption: 'rootOption'
}))

jest.mock('@mui/base/useOption', () => ({
  useOption: jest.fn().mockImplementation(({ disabled }) => ({
    getRootProps: jest.fn().mockReturnValue({
      role: 'option',
      ...(disabled && { 'aria-disabled': 'true' })
    })
  }))
}))

describe('Option', () => {
  it('renders children correctly', () => {
    const childText = 'Option 1'

    render(<Option>{childText}</Option>)

    expect(screen.getByRole('option')).toHaveTextContent(childText)
  })

  it('handles disabled prop', () => {
    render(<Option disabled>Disabled Option</Option>)

    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies custom className', () => {
    const customClass = 'myCustomClass'

    render(<Option className={customClass}>Option with custom class</Option>)

    expect(screen.getByRole('option')).toHaveClass('rootOption', customClass)
  })

  it('passes unrecognized props to the li element', () => {
    const testId = 'test-id'

    render(<Option data-testid={testId}>Option with data-testid</Option>)

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })
})
