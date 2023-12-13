import React from 'react'
import { render, screen } from '@testing-library/react'
import { withContainer } from './withContainer'

const MockComponent: React.FC<{ card?: boolean }> = () => <div>Mock Component</div>
const MockErrorFallback = () => <div>Error Fallback</div>

describe('withContainer HOC', () => {
  const WithContainerComponent = withContainer(MockComponent, MockErrorFallback)
  let originalConsoleError: jest.SpyInstance

  beforeEach(() => {
    // Mock console.error before each test with TypeScript typing
    originalConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore the original console.error after each test
    originalConsoleError.mockRestore()
  })

  it('renders the wrapped component', () => {
    render(<WithContainerComponent />)

    expect(screen.getByText('Mock Component')).toBeInTheDocument()
  })

  it('renders error fallback on error', () => {
    const ProblematicComponent = () => {
      throw new Error('Test Error')
    }
    const WithProblematicComponent = withContainer(ProblematicComponent, MockErrorFallback)

    render(<WithProblematicComponent />)

    expect(screen.getByText('Error Fallback')).toBeInTheDocument()
  })

  it('wraps component with Card when card prop is true', () => {
    const { getByTestId } = render(<WithContainerComponent card />)

    expect(getByTestId('card')).toBeInTheDocument()
  })
})
