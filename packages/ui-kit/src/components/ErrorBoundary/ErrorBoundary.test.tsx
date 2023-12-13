import { render, screen } from '@testing-library/react'
import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

const ProblematicComponent = () => {
  throw new Error('Test Error')
  return <div>Problematic Component</div>
}

describe('ErrorBoundary', () => {
  const FallbackComponent = () => <div>Error occurred</div>
  let originalConsoleError: jest.SpyInstance

  beforeEach(() => {
    // Mock console.error before each test with TypeScript typing
    originalConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore the original console.error after each test
    originalConsoleError.mockRestore()
  })

  it('should render the children if no error is thrown', () => {
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <div>Normal Behavior</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal Behavior')).toBeInTheDocument()
    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument()
  })

  it('should render the fallback UI when an error is thrown', () => {
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ProblematicComponent />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Normal Behavior')).not.toBeInTheDocument()
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })
})
