import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button } from './Button'

jest.mock('./Button.module.scss', () => ({
  rootButton: 'rootButton',
  primary: 'primary',
  disabled: 'disabled',
  active: 'active',
  focusVisible: 'focusVisible'
}))

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Default</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('rootButton')
  })

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('primary')
  })

  it('renders as disabled', () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled')
  })

  it('renders the button with start and end adornments', () => {
    const StartAdornment = () => <span>Start</span>
    const EndAdornment = () => <span>End</span>

    render(
      <Button startAdornment={StartAdornment} endAdornment={EndAdornment}>
        Adornments
      </Button>
    )

    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeInTheDocument()
  })

  it('applies custom class when className prop is provided', () => {
    const customClass = 'my-custom-class'

    render(<Button className={customClass}>Custom Class</Button>)

    expect(screen.getByRole('button')).toHaveClass(customClass)
  })

  it('accepts a ref', () => {
    const ref = React.createRef<HTMLButtonElement>()

    render(<Button ref={ref}>Ref</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
