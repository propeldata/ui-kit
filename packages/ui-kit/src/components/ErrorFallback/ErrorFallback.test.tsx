import { render, screen } from '@testing-library/react'
import React from 'react'
import { ErrorFallback, serverErrorMessage } from './ErrorFallback'

describe('ErrorFallback', () => {
  it('renders default error message when no error prop is provided', () => {
    render(<ErrorFallback />)

    expect(screen.getByText(serverErrorMessage.title)).toBeInTheDocument()
    expect(screen.getByText(serverErrorMessage.body)).toBeInTheDocument()
  })

  it('renders custom error message when error prop is provided', () => {
    const customError = {
      title: 'Custom Error',
      body: 'Custom error description.'
    }

    render(<ErrorFallback error={customError} />)

    expect(screen.getByText(customError.title)).toBeInTheDocument()
    expect(screen.getByText(customError.body)).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const className = 'custom-class'
    render(<ErrorFallback className={className} />)

    const container = screen.getByTestId('error-fallback-container')
    expect(container).toHaveClass(className)
  })
})
